import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { assertString } from '../lib/errors';
import { sessionRef } from '../repositories/refs';
import { fetchGoogleUser } from '../services/auth';
import { deleteAllUserData } from '../services/user-data';
import '../config';

export const completeGoogleLinkCleanup = onCall(async (request) => {
	const requestUid = request.auth?.uid;
	if (!requestUid) {
		throw new HttpsError('unauthenticated', 'You must be signed in with Google to finish cleanup.');
	}

	const googleUser = await fetchGoogleUser(requestUid);
	const sessionId = assertString(request.data?.sessionId, 'sessionId');
	const sessionSnapshot = await sessionRef(sessionId).get();
	if (!sessionSnapshot.exists) {
		throw new HttpsError('not-found', 'Google link session not found.');
	}

	const session = sessionSnapshot.data() ?? {};
	const status = String(session.status ?? 'pending');
	const sourceUid = String(session.sourceUid ?? '');
	const targetUid = String(session.targetGoogleUid ?? '');
	const targetGoogleEmail = String(session.targetGoogleEmail ?? '');
	const targetGoogleDisplayName = String(session.targetGoogleDisplayName ?? '');

	if (!targetUid || googleUser.uid !== targetUid) {
		throw new HttpsError('permission-denied', 'Only the linked Google account can finish cleanup.');
	}

	if (status === 'consumed') {
		return {
			status: 'consumed' as const,
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

	if (status !== 'switched') {
		throw new HttpsError('failed-precondition', `Session is ${status}.`);
	}

	try {
		if (sourceUid && sourceUid !== targetUid) {
			await deleteAllUserData(sourceUid);
		}

		await sessionRef(sessionId).set(
			{
				status: 'consumed',
				cleanupCompletedAt: FieldValue.serverTimestamp(),
				completedAt: FieldValue.serverTimestamp(),
				consumedAt: FieldValue.serverTimestamp(),
				updatedAt: FieldValue.serverTimestamp(),
				errorCode: null,
				errorMessage: null,
			},
			{ merge: true },
		);

		logger.info('google link cleanup completed', { sessionId, sourceUid, targetUid });

		return {
			status: 'consumed' as const,
			targetUid,
			account: {
				uid: targetUid,
				authProvider: 'google' as const,
				googleEmail: targetGoogleEmail,
				googleDisplayName: targetGoogleDisplayName,
				isAnonymous: false,
			},
		};
	} catch (error) {
		await sessionRef(sessionId).set(
			{
				errorCode: error instanceof HttpsError ? error.code : 'cleanup-failed',
				errorMessage: error instanceof Error ? error.message : 'Could not finish cleanup after switching accounts.',
				updatedAt: FieldValue.serverTimestamp(),
			},
			{ merge: true },
		);

		logger.error('google link cleanup failed', { sessionId, sourceUid, targetUid, error });
		throw error;
	}
});
