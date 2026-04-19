import { Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { assertString } from '../lib/errors';
import { handoffCodeRef } from '../repositories/refs';
import '../config';

/**
 * Called by the link site AFTER Google sign-in completes. Stamps the
 * authenticated user's Firebase UID onto the handoff doc so the WebView
 * (which is polling) can exchange it for a custom token.
 *
 * Requires Firebase auth — the caller is the user who just signed in with
 * Google on the link site's authorized domain.
 */
export const authorizeHandoffCode = onCall(async (request) => {
	if (!request.auth) {
		throw new HttpsError('unauthenticated', 'Sign in with Google before authorizing.');
	}
	const code = assertString(request.data?.code, 'code');
	const ref = handoffCodeRef(code);

	await ref.firestore.runTransaction(async (tx) => {
		const snap = await tx.get(ref);
		if (!snap.exists) throw new HttpsError('not-found', 'This pairing code is invalid.');
		const data = snap.data()!;
		if (data.status !== 'pending') {
			throw new HttpsError('failed-precondition', `Code already ${data.status}.`);
		}
		const expiresAtMs = (data.expiresAt as Timestamp).toMillis();
		if (expiresAtMs <= Date.now()) {
			tx.update(ref, { status: 'expired' });
			throw new HttpsError('deadline-exceeded', 'This code expired.');
		}
		tx.update(ref, {
			status: 'authorized',
			firebaseUid: request.auth!.uid,
			authorizedAt: Timestamp.now(),
		});
	});

	return { ok: true as const };
});
