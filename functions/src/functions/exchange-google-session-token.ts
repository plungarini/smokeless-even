import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { SESSION_TTL_MS } from '../config';
import { generateSessionToken, hashSessionToken } from '../lib/code';
import { assertString } from '../lib/errors';
import { adminAuth } from '../lib/firebase';
import { googleSessionRef } from '../repositories/refs';
import '../config';

/**
 * Rotating session-token exchange with a two-token grace window.
 *
 * The WebView presents the session token stored in Bridge Local Storage.
 * We verify it, mint a fresh custom token, and issue a new session token.
 * The old token is kept as a "previous" token for exactly one more exchange,
 * so that if the app/WebView crashes after we rotate but before the client
 * persists the new token, the client can recover on the next boot without
 * forcing a full re-authentication.
 *
 * Backward-compatible with legacy docs that only have `sessionTokenHash`.
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

		const expiresAtMs = (data.expiresAt as Timestamp).toMillis();
		if (expiresAtMs <= Date.now()) {
			tx.delete(ref);
			throw new HttpsError('failed-precondition', 'Session expired. Sign in again.');
		}

		// Resolve hashes with backward compatibility for legacy `sessionTokenHash`.
		const currentHash =
			(data.currentTokenHash as string | undefined) ||
			(data.sessionTokenHash as string | undefined) ||
			'';
		const previousHash = (data.previousTokenHash as string | undefined) || '';

		if (presentedHash !== currentHash && presentedHash !== previousHash) {
			// Potential token leak — nuke the session.
			tx.delete(ref);
			throw new HttpsError('permission-denied', 'Session token invalid.');
		}

		// Token is valid (current or previous) and not expired — rotate.
		tx.update(ref, {
			currentTokenHash: hashSessionToken(nextToken),
			previousTokenHash: currentHash,
			expiresAt: nextExpiresAt,
			rotatedAt: Timestamp.now(),
			// Clean up legacy single-hash field if present.
			...(data.sessionTokenHash !== undefined ? { sessionTokenHash: FieldValue.delete() } : {}),
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
