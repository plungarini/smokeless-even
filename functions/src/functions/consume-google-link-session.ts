import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { assertString } from '../lib/errors';
import { adminAuth } from '../lib/firebase';
import { sessionRef, userRef } from '../repositories/refs';
import { fetchAllLogEntries, fetchUserDocument } from '../repositories/users';
import { buildGoogleProvider, deleteAllUserData, mergeUserDocuments, rewriteLogs } from '../services/user-data';
import { dedupeLogs, rebuildIntervals } from '../services/log-merge';
import { updateUserMetrics } from '../services/user-metrics';
import { assertActiveSession } from '../services/sessions';
import '../config';

export const consumeGoogleLinkSession = onCall(async (request) => {
	const requestUid = request.auth?.uid;
	if (!requestUid) {
		throw new HttpsError('unauthenticated', 'You must be signed in to finish Google linking.');
	}

	const sessionId = assertString(request.data?.sessionId, 'sessionId');
	const sessionSnapshot = await sessionRef(sessionId).get();
	const session = assertActiveSession(sessionSnapshot, ['authorized']);

	if (String(session.sourceUid ?? '') !== requestUid) {
		throw new HttpsError('permission-denied', 'Only the source account can consume this session.');
	}

	const sourceUid = String(session.sourceUid ?? '');
	const sourceEvenUid = String(session.sourceEvenUid ?? '');
	const targetUid = String(session.targetGoogleUid ?? '');
	const targetGoogleEmail = String(session.targetGoogleEmail ?? '');
	const targetGoogleDisplayName = String(session.targetGoogleDisplayName ?? '');

	if (!targetUid) {
		throw new HttpsError('failed-precondition', 'Google authorization is incomplete for this session.');
	}

	const [sourceDocument, targetDocument, sourceLogs, targetLogs] = await Promise.all([
		fetchUserDocument(sourceUid),
		fetchUserDocument(targetUid),
		fetchAllLogEntries(sourceUid),
		fetchAllLogEntries(targetUid),
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

	const mergedGoogle = buildGoogleProvider(targetUid, targetGoogleEmail, targetGoogleDisplayName);
	const mergedDocument = mergeUserDocuments(targetDocument, sourceDocument, mergedGoogle);
	const mergedLogs = rebuildIntervals(dedupeLogs([...targetLogs, ...sourceLogs]));

	await rewriteLogs(targetUid, mergedLogs);
	await userRef(targetUid).set(
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
	await updateUserMetrics(targetUid, mergedLogs);

	if (sourceUid !== targetUid) {
		await deleteAllUserData(sourceUid);
	}

	await sessionRef(sessionId).set(
		{
			status: 'consumed',
			completedAt: FieldValue.serverTimestamp(),
			consumedAt: FieldValue.serverTimestamp(),
			updatedAt: FieldValue.serverTimestamp(),
			errorCode: null,
			errorMessage: null,
		},
		{ merge: true },
	);

	const customToken = await adminAuth.createCustomToken(targetUid);

	return {
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
});
