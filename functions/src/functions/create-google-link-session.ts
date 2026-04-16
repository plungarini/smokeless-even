import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { GOOGLE_LINK_URL, SESSION_TTL_MS } from '../config';
import { assertString } from '../lib/errors';
import { generatePairingCode, hashPairingCode } from '../lib/pairing-code';
import { newSessionRef } from '../repositories/refs';
import { invalidateOpenSessions } from '../repositories/sessions';
import { assertSourceUserNotGoogleLinked } from '../services/auth';
import '../config';

export const createGoogleLinkSession = onCall(async (request) => {
	if (!request.auth?.uid) {
		throw new HttpsError('unauthenticated', 'You must be signed in to start Google linking.');
	}

	const sourceEvenUid = assertString(request.data?.sourceEvenUid, 'sourceEvenUid');
	await assertSourceUserNotGoogleLinked(request.auth.uid);
	await invalidateOpenSessions(request.auth.uid);

	const sessionDocument = newSessionRef();
	const sessionId = sessionDocument.id;
	const code = generatePairingCode();
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

	await sessionDocument.set({
		sessionId,
		sourceUid: request.auth.uid,
		sourceEvenUid,
		status: 'pending',
		codeHash: hashPairingCode(code),
		expiresAt,
		createdAt: FieldValue.serverTimestamp(),
		updatedAt: FieldValue.serverTimestamp(),
		authorizedAt: null,
		migrationStartedAt: null,
		migrationCompletedAt: null,
		switchClaimedAt: null,
		switchErrorAt: null,
		cleanupCompletedAt: null,
		completedAt: null,
		consumedAt: null,
		targetGoogleUid: null,
		targetGoogleEmail: null,
		targetGoogleDisplayName: null,
		errorCode: null,
		errorMessage: null,
	});

	return {
		sessionId,
		code,
		expiresAt: expiresAt.toISOString(),
		linkUrl: GOOGLE_LINK_URL,
	};
});
