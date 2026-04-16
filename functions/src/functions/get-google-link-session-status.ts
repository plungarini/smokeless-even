import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { assertString } from '../lib/errors';
import { toDate } from '../lib/firestore-mappers';
import { sessionRef } from '../repositories/refs';
import '../config';

export const getGoogleLinkSessionStatus = onCall(async (request) => {
	const requestUid = request.auth?.uid;
	if (!requestUid) {
		throw new HttpsError('unauthenticated', 'You must be signed in to read Google link status.');
	}

	const sessionId = assertString(request.data?.sessionId, 'sessionId');
	const sessionSnapshot = await sessionRef(sessionId).get();
	if (!sessionSnapshot.exists) {
		throw new HttpsError('not-found', 'Google link session not found.');
	}

	const data = sessionSnapshot.data() ?? {};
	if (String(data.sourceUid ?? '') !== requestUid) {
		throw new HttpsError('permission-denied', 'This session does not belong to the current user.');
	}

	return {
		status: String(data.status ?? 'pending'),
		expiresAt: (toDate(data.expiresAt) ?? new Date()).toISOString(),
		targetGoogleUid: typeof data.targetGoogleUid === 'string' ? data.targetGoogleUid : undefined,
		targetGoogleEmail: typeof data.targetGoogleEmail === 'string' ? data.targetGoogleEmail : undefined,
		targetGoogleDisplayName: typeof data.targetGoogleDisplayName === 'string' ? data.targetGoogleDisplayName : undefined,
		switchErrorAt: toDate(data.switchErrorAt)?.toISOString(),
		errorCode: typeof data.errorCode === 'string' ? data.errorCode : undefined,
		errorMessage: typeof data.errorMessage === 'string' ? data.errorMessage : undefined,
	};
});
