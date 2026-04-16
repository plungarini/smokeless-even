import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { assertString } from '../lib/errors';
import { sessionRef } from '../repositories/refs';
import { fetchGoogleUser } from '../services/auth';
import { assertActiveSession } from '../services/sessions';
import '../config';

export const completeGoogleLinkSession = onCall(async (request) => {
	const requestUid = request.auth?.uid;
	if (!requestUid) {
		throw new HttpsError('unauthenticated', 'You must be signed in with Google to complete linking.');
	}

	const googleUser = await fetchGoogleUser(requestUid);
	const sessionId = assertString(request.data?.sessionId, 'sessionId');
	const sessionSnapshot = await sessionRef(sessionId).get();
	const session = assertActiveSession(sessionSnapshot, ['pending', 'authorized']);

	if (session.sourceUid === googleUser.uid) {
		throw new HttpsError('failed-precondition', 'The target Google account must be different from the anonymous source account.');
	}

	await sessionRef(sessionId).set(
		{
			status: 'authorized',
			targetGoogleUid: googleUser.uid,
			targetGoogleEmail: googleUser.email,
			targetGoogleDisplayName: googleUser.displayName,
			authorizedAt: FieldValue.serverTimestamp(),
			updatedAt: FieldValue.serverTimestamp(),
			errorCode: null,
			errorMessage: null,
		},
		{ merge: true },
	);

	return {
		status: 'authorized' as const,
		targetGoogleEmail: googleUser.email,
		targetGoogleDisplayName: googleUser.displayName,
	};
});
