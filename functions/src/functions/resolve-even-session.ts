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
interface ResolveEvenSessionResult {
	customToken: string | null;
	firebaseUid: string | null;
	errorCode?: 'no-mapping' | 'custom-token-mint-failed' | 'lookup-failed';
	errorMessage?: string;
}

export const resolveEvenSession = onCall(async (request): Promise<ResolveEvenSessionResult> => {
	const evenUid = typeof request.data?.evenUid === 'string' ? request.data.evenUid.trim() : '';
	if (!evenUid) {
		return { customToken: null, firebaseUid: null, errorCode: 'no-mapping' };
	}

	let firebaseUid = '';
	try {
		const snapshot = await evenUidIndexRef(evenUid).get();
		if (!snapshot.exists) {
			return { customToken: null, firebaseUid: null, errorCode: 'no-mapping' };
		}
		firebaseUid = String(snapshot.data()?.firebaseUid ?? '');
		if (!firebaseUid) {
			return { customToken: null, firebaseUid: null, errorCode: 'no-mapping' };
		}
	} catch (error) {
		logger.error('resolveEvenSession: index lookup failed', { evenUid, error });
		return {
			customToken: null,
			firebaseUid: null,
			errorCode: 'lookup-failed',
			errorMessage: error instanceof Error ? error.message : 'Even UID index lookup failed.',
		};
	}

	try {
		const customToken = await adminAuth.createCustomToken(firebaseUid);
		logger.info('resolveEvenSession: issued custom token', { evenUid, firebaseUid });
		return { customToken, firebaseUid };
	} catch (error) {
		logger.error('resolveEvenSession: custom token mint failed', {
			evenUid,
			firebaseUid,
			projectId: process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT ?? null,
			signerIdentityHint: process.env.GCLOUD_PROJECT ? `${process.env.GCLOUD_PROJECT}@appspot.gserviceaccount.com` : null,
			error,
		});
		return {
			customToken: null,
			firebaseUid,
			errorCode: 'custom-token-mint-failed',
			errorMessage: error instanceof Error ? error.message : 'Custom token mint failed.',
		};
	}
});
