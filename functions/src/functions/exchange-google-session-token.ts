import { Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { SESSION_TTL_MS } from '../config';
import { generateSessionToken, hashSessionToken } from '../lib/code';
import { assertString } from '../lib/errors';
import { adminAuth } from '../lib/firebase';
import { googleSessionRef } from '../repositories/refs';
import '../config';

/**
 * Rotating session-token exchange. The WebView presents the session token
 * stored in Bridge Local Storage; we verify it, mint a fresh custom token
 * to log the user back in, and issue a new session token (the old one is
 * immediately invalidated). This keeps Google-mode users signed in for the
 * long haul without re-doing Google Sign-In.
 *
 * Callable without Firebase auth — the whole point is to re-auth.
 */
export const exchangeGoogleSessionToken = onCall(async (request) => {
	const firebaseUid = assertString(request.data?.firebaseUid, 'firebaseUid');
	const sessionToken = assertString(request.data?.sessionToken, 'sessionToken');

	const ref = googleSessionRef(firebaseUid);
	const presentedHash = hashSessionToken(sessionToken);

	const nextToken = generateSessionToken();
	const nextExpiresAt = Timestamp.fromMillis(Date.now() + SESSION_TTL_MS);

	await ref.firestore.runTransaction(async (tx) => {
		const snap = await tx.get(ref);
		if (!snap.exists) throw new HttpsError('not-found', 'No session on file.');
		const data = snap.data()!;
		if (data.firebaseUid !== firebaseUid) {
			throw new HttpsError('permission-denied', 'Session UID mismatch.');
		}
		if (data.sessionTokenHash !== presentedHash) {
			// Potential token leak — nuke the session.
			tx.delete(ref);
			throw new HttpsError('permission-denied', 'Session token invalid.');
		}
		const expiresAtMs = (data.expiresAt as Timestamp).toMillis();
		if (expiresAtMs <= Date.now()) {
			tx.delete(ref);
			throw new HttpsError('deadline-exceeded', 'Session expired. Sign in again.');
		}
		tx.update(ref, {
			sessionTokenHash: hashSessionToken(nextToken),
			expiresAt: nextExpiresAt,
			rotatedAt: Timestamp.now(),
		});
	});

	const customToken = await adminAuth.createCustomToken(firebaseUid);
	return {
		customToken,
		firebaseUid,
		nextSessionToken: nextToken,
		nextExpiresAt: nextExpiresAt.toDate().toISOString(),
	};
});
