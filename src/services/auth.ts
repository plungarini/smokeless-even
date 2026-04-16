import { GoogleAuthProvider, signInAnonymously, signInWithCustomToken, type User } from 'firebase/auth';
import { auth, subscribeToAuthState, waitForInitialAuthState } from '../lib/firebase';
import type { AuthAccountInfo } from '../domain/types';

function toAccountInfo(user: User | null): AuthAccountInfo | null {
	if (!user) return null;

	const googleProfile = user.providerData.find((entry) => entry?.providerId === GoogleAuthProvider.PROVIDER_ID);

	return {
		uid: user.uid,
		authProvider: googleProfile ? 'google' : 'anonymous',
		googleEmail: googleProfile?.email ?? user.email ?? '',
		googleDisplayName: googleProfile?.displayName ?? user.displayName ?? '',
		isAnonymous: user.isAnonymous,
	};
}

export function getCurrentAccountInfo(): AuthAccountInfo | null {
	return toAccountInfo(auth.currentUser);
}

export async function ensureFirebaseSession(): Promise<string> {
	await waitForInitialAuthState();

	if (auth.currentUser?.uid) {
		return auth.currentUser.uid;
	}

	const credential = await signInAnonymously(auth);
	return credential.user.uid;
}

export async function signInWithCanonicalCustomToken(customToken: string): Promise<AuthAccountInfo> {
	const credential = await signInWithCustomToken(auth, customToken);
	return toAccountInfo(credential.user) ?? {
		uid: credential.user.uid,
		authProvider: 'anonymous',
		googleEmail: '',
		googleDisplayName: '',
		isAnonymous: credential.user.isAnonymous,
	};
}

export function observeAccountInfo(onValue: (account: AuthAccountInfo | null) => void): () => void {
	return subscribeToAuthState((user) => onValue(toAccountInfo(user)));
}
