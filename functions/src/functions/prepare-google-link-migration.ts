import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { assertString } from '../lib/errors';
import { sessionRef } from '../repositories/refs';
import { fetchAllLogEntries, fetchUserDocument } from '../repositories/users';
import { fetchGoogleUser } from '../services/auth';
import { dedupeLogs, rebuildIntervals } from '../services/log-merge';
import { assertActiveSession } from '../services/sessions';
import { applyMergedUserData, buildGoogleProvider, mergeUserDocuments } from '../services/user-data';
import '../config';

export const prepareGoogleLinkMigration = onCall(async (request) => {
	const requestUid = request.auth?.uid;
	if (!requestUid) {
		throw new HttpsError('unauthenticated', 'You must be signed in with Google to prepare linking.');
	}

	const googleUser = await fetchGoogleUser(requestUid);
	const sessionId = assertString(request.data?.sessionId, 'sessionId');
	const sessionSnapshot = await sessionRef(sessionId).get();
	if (!sessionSnapshot.exists) {
		throw new HttpsError('not-found', 'Google link session not found.');
	}

	const current = sessionSnapshot.data() ?? {};
	const currentStatus = String(current.status ?? 'pending');
	const sourceUid = String(current.sourceUid ?? '');
	const sourceEvenUid = String(current.sourceEvenUid ?? '');
	const targetUid = String(current.targetGoogleUid ?? '');
	const targetGoogleEmail = String(current.targetGoogleEmail ?? '');
	const targetGoogleDisplayName = String(current.targetGoogleDisplayName ?? '');

	if (currentStatus === 'ready_to_switch' || currentStatus === 'switched' || currentStatus === 'consumed') {
		if (requestUid !== targetUid) {
			throw new HttpsError('permission-denied', 'Only the authorized Google account can read this migration state.');
		}

		return {
			status: currentStatus,
			targetUid,
			targetGoogleEmail,
			targetGoogleDisplayName,
		};
	}

	const session = assertActiveSession(sessionSnapshot, ['authorized', 'migrating']);
	const resolvedTargetUid = String(session.targetGoogleUid ?? targetUid ?? '');
	if (!resolvedTargetUid || resolvedTargetUid !== googleUser.uid) {
		throw new HttpsError('permission-denied', 'Only the authorized Google account can prepare this migration.');
	}

	await sessionRef(sessionId).set(
		{
			status: 'migrating',
			migrationStartedAt: FieldValue.serverTimestamp(),
			updatedAt: FieldValue.serverTimestamp(),
			errorCode: null,
			errorMessage: null,
		},
		{ merge: true },
	);

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

		const mergedDocument = mergeUserDocuments(
			targetDocument,
			sourceDocument,
			buildGoogleProvider(
				resolvedTargetUid,
				googleUser.email || targetGoogleEmail,
				googleUser.displayName || targetGoogleDisplayName,
			),
		);
		const mergedLogs = rebuildIntervals(dedupeLogs([...targetLogs, ...sourceLogs]));

		await applyMergedUserData({
			targetUid: resolvedTargetUid,
			targetDocument,
			sourceDocument,
			mergedDocument,
			mergedLogs,
		});

		await sessionRef(sessionId).set(
			{
				status: 'ready_to_switch',
				targetGoogleUid: resolvedTargetUid,
				targetGoogleEmail: googleUser.email || targetGoogleEmail,
				targetGoogleDisplayName: googleUser.displayName || targetGoogleDisplayName,
				migrationCompletedAt: FieldValue.serverTimestamp(),
				updatedAt: FieldValue.serverTimestamp(),
				errorCode: null,
				errorMessage: null,
			},
			{ merge: true },
		);

		logger.info('google link migration prepared', {
			sessionId,
			sourceUid,
			targetUid: resolvedTargetUid,
			sourceLogCount: sourceLogs.length,
			targetLogCount: targetLogs.length,
			mergedLogCount: mergedLogs.length,
		});

		return {
			status: 'ready_to_switch' as const,
			targetUid: resolvedTargetUid,
			targetGoogleEmail: googleUser.email || targetGoogleEmail,
			targetGoogleDisplayName: googleUser.displayName || targetGoogleDisplayName,
		};
	} catch (error) {
		if (!(error instanceof HttpsError && error.code === 'already-exists')) {
			await sessionRef(sessionId).set(
				{
					status: 'failed',
					errorCode: error instanceof HttpsError ? error.code : 'migration-failed',
					errorMessage: error instanceof Error ? error.message : 'Could not prepare the Google account migration.',
					updatedAt: FieldValue.serverTimestamp(),
				},
				{ merge: true },
			);
		}

		logger.error('google link migration prepare failed', {
			sessionId,
			sourceUid,
			targetUid: resolvedTargetUid,
			error,
		});
		throw error;
	}
});
