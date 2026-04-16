import { HttpsError } from 'firebase-functions/v2/https';
import { GOOGLE_PROVIDER_ID } from '../config';
import type { SessionGoogleUser } from '../domain/types';
import { adminAuth } from '../lib/firebase';

export async function fetchGoogleUser(requestUid: string): Promise<SessionGoogleUser> {
	const userRecord = await adminAuth.getUser(requestUid);
	const googleProvider = userRecord.providerData.find((provider) => provider.providerId === GOOGLE_PROVIDER_ID);
	if (!googleProvider) {
		throw new HttpsError('failed-precondition', 'A Google account is required for this action.');
	}

	return {
		uid: userRecord.uid,
		email: googleProvider.email ?? userRecord.email ?? '',
		displayName: googleProvider.displayName ?? userRecord.displayName ?? '',
	};
}

export async function assertSourceUserNotGoogleLinked(uid: string): Promise<void> {
	const sourceUser = await adminAuth.getUser(uid);
	if (sourceUser.providerData.some((provider) => provider.providerId === GOOGLE_PROVIDER_ID)) {
		throw new HttpsError('failed-precondition', 'This Firebase account is already linked to Google.');
	}
}
