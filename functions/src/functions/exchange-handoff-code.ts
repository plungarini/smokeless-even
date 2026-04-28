import { Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { SESSION_TTL_MS } from '../config';
import { generateSessionToken, hashSessionToken } from '../lib/code';
import { assertString } from '../lib/errors';
import { adminAuth } from '../lib/firebase';
import { googleSessionRef, handoffCodeRef } from '../repositories/refs';
import '../config';

/**
 * Called by the WebView (unauthenticated — still waiting for sign-in).
 * Polls the handoff doc until the link site has stamped it `authorized`,
 * at which point we:
 *   1. Mint a Firebase custom token for the authorized Firebase UID.
 *   2. Issue a long-lived rotating session token, hashed into Firestore
 *      so the client can silently re-auth on future WebView restarts.
 *   3. Mark the handoff doc `consumed` — single use.
 */
export const exchangeHandoffCode = onCall(async (request) => {
	const code = assertString(request.data?.code, 'code');
	const ref = handoffCodeRef(code);
	const snap = await ref.get();
	if (!snap.exists) throw new HttpsError('not-found', 'Invalid pairing code.');
	const data = snap.data()!;
	const expiresAtMs = (data.expiresAt as Timestamp).toMillis();

	if (data.status === 'pending') {
		if (expiresAtMs <= Date.now()) {
			await ref.update({ status: 'expired' });
			return { status: 'expired' as const };
		}
		return { status: 'pending' as const };
	}

	if (data.status === 'expired' || data.status === 'cancelled') {
		return { status: data.status as 'expired' | 'cancelled' };
	}

	if (data.status !== 'authorized') {
		// 'consumed' or unknown — treat as cancelled so the client gives up.
		return { status: 'cancelled' as const };
	}

	const firebaseUid = String(data.firebaseUid ?? '');
	if (!firebaseUid) throw new HttpsError('internal', 'Handoff missing firebaseUid.');

	const customToken = await adminAuth.createCustomToken(firebaseUid);
	const sessionToken = generateSessionToken();
	const expiresAt = Timestamp.fromMillis(Date.now() + SESSION_TTL_MS);

	// Persist the HASHED token only — the plaintext never hits Firestore.
	// Use the new two-token schema so the first exchange already supports
	// the grace-recovery window.
	await googleSessionRef(firebaseUid).set({
		firebaseUid,
		currentTokenHash: hashSessionToken(sessionToken),
		previousTokenHash: '',
		expiresAt,
		rotatedAt: Timestamp.now(),
	});

	// Single-use the handoff doc.
	await ref.update({ status: 'consumed', consumedAt: Timestamp.now() });

	return {
		status: 'authorized' as const,
		customToken,
		firebaseUid,
		sessionToken,
		sessionExpiresAt: expiresAt.toDate().toISOString(),
	};
});
