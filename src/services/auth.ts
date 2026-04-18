import { GoogleAuthProvider, signInAnonymously, signInWithCustomToken, type User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions, subscribeToAuthState, waitForInitialAuthState } from '../lib/firebase';
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

/**
 * Before signing in anonymously, attempt to recover the canonical Firebase
 * session for this Even user via the `resolveEvenSession` Cloud Function.
 *
 * The function reads `evenUidIndex/{evenUid}` server-side (bypassing the
 * Firestore `list: false` rule) and returns a custom token for the stored
 * Firebase UID — allowing the app to sign in as the original account even if
 * the WebView's IndexedDB auth state was cleared (e.g. after a Google link).
 *
 * Errors are swallowed: if the lookup fails for any reason the caller falls
 * through to `ensureFirebaseSession()` which issues a fresh anonymous UID.
 */
export async function tryRestoreSessionFromEvenUid(evenUid: string): Promise<void> {
	// Only act if auth state is not already known.
	await waitForInitialAuthState();
	if (auth.currentUser) return;

	try {
		const resolve = httpsCallable<{ evenUid: string }, { customToken: string | null }>(
			functions,
			'resolveEvenSession',
		);
		const result = await resolve({ evenUid });
		const customToken = result.data?.customToken;
		if (customToken) {
			await signInWithCustomToken(auth, customToken);
			console.info('[Auth] restored session via Even UID index', { evenUid });
		}
	} catch (error) {
		// Non-fatal: fall through to anonymous sign-in.
		console.warn('[Auth] resolveEvenSession failed, falling back to anonymous', error);
	}
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
