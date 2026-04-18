import * as logger from 'firebase-functions/logger';
import { onCall } from 'firebase-functions/v2/https';
import { adminAuth } from '../lib/firebase';
import { evenUidIndexRef } from '../repositories/refs';
import '../config';

/**
 * Resolves an Even UID to a Firebase custom token for the canonical Firebase
 * account associated with that Even profile. Called by the client on every
 * bootstrap before falling back to anonymous sign-in, so that users who lose
 * their WebView auth state (e.g. after a Google-link account switch) are
 * transparently signed back in as their canonical account rather than being
 * issued a fresh anonymous UID and a duplicate Firestore document.
 *
 * This function is intentionally callable without Firebase auth — the client
 * has not signed in yet when it calls this. The only input is the Even UID
 * obtained from the Even Hub bridge, which is an opaque identifier that the
 * caller already knows. The custom token it returns allows signing in as the
 * mapped Firebase UID, which then falls under the normal Firestore security
 * rules protecting that account's data.
 */
export const resolveEvenSession = onCall(async (request) => {
	const evenUid = typeof request.data?.evenUid === 'string' ? request.data.evenUid.trim() : '';
	if (!evenUid) {
		return { customToken: null };
	}

	try {
		const snapshot = await evenUidIndexRef(evenUid).get();
		if (!snapshot.exists) {
			return { customToken: null };
		}

		const firebaseUid = String(snapshot.data()?.firebaseUid ?? '');
		if (!firebaseUid) {
			return { customToken: null };
		}

		const customToken = await adminAuth.createCustomToken(firebaseUid);

		logger.info('resolveEvenSession: issued custom token', { evenUid, firebaseUid });
		return { customToken };
	} catch (error) {
		// Never throw — a failed lookup is not an error from the client's perspective.
		// The caller will fall back to anonymous sign-in.
		logger.error('resolveEvenSession: lookup or token mint failed', { evenUid, error });
		return { customToken: null };
	}
});
