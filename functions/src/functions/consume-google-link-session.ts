import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { assertString } from '../lib/errors';
import { adminAuth } from '../lib/firebase';
import { sessionRef, userRef } from '../repositories/refs';
import { fetchAllLogEntries, fetchUserDocument } from '../repositories/users';
import { fetchGoogleUser } from '../services/auth';
import { buildGoogleProvider, deleteAllUserData, mergeUserDocuments, rewriteLogs } from '../services/user-data';
import { dedupeLogs, rebuildIntervals } from '../services/log-merge';
import { updateUserMetrics } from '../services/user-metrics';
import { assertActiveSession } from '../services/sessions';
import '../config';

export const consumeGoogleLinkSession = onCall(async (request) => {
	const requestUid = request.auth?.uid;
	if (!requestUid) {
		throw new HttpsError('unauthenticated', 'You must be signed in to continue Google linking.');
	}

	const sessionId = assertString(request.data?.sessionId, 'sessionId');
	const sessionSnapshot = await sessionRef(sessionId).get();
	if (!sessionSnapshot.exists) {
		throw new HttpsError('not-found', 'Google link session not found.');
	}

	const session = sessionSnapshot.data() ?? {};
	const status = String(session.status ?? 'pending');
	const sourceUid = String(session.sourceUid ?? '');
	const sourceEvenUid = String(session.sourceEvenUid ?? '');
	const targetUid = String(session.targetGoogleUid ?? '');
	const targetGoogleEmail = String(session.targetGoogleEmail ?? '');
	const targetGoogleDisplayName = String(session.targetGoogleDisplayName ?? '');

	if (status === 'consumed') {
		if (requestUid !== sourceUid) {
			throw new HttpsError('permission-denied', 'Only the original Smokeless session can switch onto the linked account.');
		}

		if (!targetUid) {
			throw new HttpsError('failed-precondition', 'This linked session is missing its Google account target.');
		}

		const customToken = await adminAuth.createCustomToken(targetUid);
		return {
			status: 'consumed' as const,
			customToken,
			targetUid,
			account: {
				uid: targetUid,
				authProvider: 'google' as const,
				googleEmail: targetGoogleEmail,
				googleDisplayName: targetGoogleDisplayName,
				isAnonymous: false,
			},
		};
	}

	const activeSession = assertActiveSession(sessionSnapshot, ['authorized']);
	const activeTargetUid = String(activeSession.targetGoogleUid ?? targetUid ?? '');
	if (!activeTargetUid) {
		throw new HttpsError('failed-precondition', 'Google authorization is incomplete for this session.');
	}

	const googleUser = await fetchGoogleUser(requestUid);
	if (googleUser.uid !== activeTargetUid) {
		throw new HttpsError('permission-denied', 'Only the authorized Google account can finish this link.');
	}

	const resolvedTargetUid = activeTargetUid;
	const resolvedTargetGoogleEmail = googleUser.email || targetGoogleEmail;
	const resolvedTargetGoogleDisplayName = googleUser.displayName || targetGoogleDisplayName;

	try {
		const [sourceDocument, targetDocument, sourceLogs, targetLogs] = await Promise.all([
			fetchUserDocument(sourceUid),
			fetchUserDocument(resolvedTargetUid),
			fetchAllLogEntries(sourceUid),
			fetchAllLogEntries(resolvedTargetUid),
		]);

		const targetEvenUid = targetDocument?.providers.even?.uid ?? '';
		if (targetEvenUid && sourceEvenUid && targetEvenUid !== sourceEvenUid) {
			await sessionRef(sessionId).set(
				{
					status: 'failed',
					errorCode: 'even-provider-conflict',
					errorMessage: 'This Google account is already linked to a different Even profile.',
					updatedAt: FieldValue.serverTimestamp(),
				},
				{ merge: true },
			);
			throw new HttpsError('already-exists', 'This Google account is already linked to a different Even profile.');
		}

		const mergedGoogle = buildGoogleProvider(resolvedTargetUid, resolvedTargetGoogleEmail, resolvedTargetGoogleDisplayName);
		const mergedDocument = mergeUserDocuments(targetDocument, sourceDocument, mergedGoogle);
		const mergedLogs = rebuildIntervals(dedupeLogs([...targetLogs, ...sourceLogs]));

		await rewriteLogs(resolvedTargetUid, mergedLogs);
		await userRef(resolvedTargetUid).set(
			{
				longestEverCessation: mergedDocument.longestEverCessation,
				todayMaxCessation: mergedDocument.todayMaxCessation,
				preferences: mergedDocument.preferences,
				onboarding: mergedDocument.onboarding,
				providers: mergedDocument.providers,
				createdAt: targetDocument?.createdAt ?? sourceDocument?.createdAt ?? FieldValue.serverTimestamp(),
				updatedAt: FieldValue.serverTimestamp(),
			},
			{ merge: true },
		);
		await updateUserMetrics(resolvedTargetUid, mergedLogs);

		if (sourceUid !== resolvedTargetUid) {
			await deleteAllUserData(sourceUid);
		}

		await sessionRef(sessionId).set(
			{
				status: 'consumed',
				targetGoogleUid: resolvedTargetUid,
				targetGoogleEmail: resolvedTargetGoogleEmail,
				targetGoogleDisplayName: resolvedTargetGoogleDisplayName,
				completedAt: FieldValue.serverTimestamp(),
				consumedAt: FieldValue.serverTimestamp(),
				updatedAt: FieldValue.serverTimestamp(),
				errorCode: null,
				errorMessage: null,
			},
			{ merge: true },
		);
	} catch (error) {
		if (!(error instanceof HttpsError && error.code === 'already-exists')) {
			await sessionRef(sessionId).set(
				{
					status: 'failed',
					errorCode: error instanceof HttpsError ? error.code : 'finalization-failed',
					errorMessage: error instanceof Error ? error.message : 'Could not finish linking this Google account.',
					updatedAt: FieldValue.serverTimestamp(),
				},
				{ merge: true },
			);
		}
		throw error;
	}

	return {
		status: 'consumed' as const,
		targetUid: resolvedTargetUid,
		account: {
			uid: resolvedTargetUid,
			authProvider: 'google' as const,
			googleEmail: resolvedTargetGoogleEmail,
			googleDisplayName: resolvedTargetGoogleDisplayName,
			isAnonymous: false,
		},
	};
});
