/**
 * Google-mode Firebase auth surface.
 *
 * Local mode NEVER calls anything in this module — guard at the call site
 * (bootstrap / db.service already do this). The only callers in Google mode
 * are bootstrap (to establish the session from a stored custom token) and
 * the token-handoff flow (Plan 4+).
 *
 * Persistent login across WebView refresh works as follows:
 *   1. GitHub Pages Google sign-in hands a short-lived custom token to the
 *      WebView via a one-time code (see token-handoff.ts).
 *   2. The WebView exchanges the code for the custom token and calls
 *      `signInWithCanonicalCustomToken`. Firebase stores its own refresh
 *      token internally in IndexedDB — which we CANNOT rely on across
 *      WebView restarts.
 *   3. We mirror a Smokeless-managed "session pointer" into Bridge Local
 *      Storage so that on every boot we can re-mint a custom token via a
 *      Cloud Function without re-doing Google sign-in. Token refresh
 *      plumbing is wired up in Plan 6.
 */

import { GoogleAuthProvider, signInWithCustomToken, signOut, type User } from 'firebase/auth';
import { getFirebaseAuth, subscribeToAuthState, waitForInitialAuthState } from '../lib/firebase';
import type { AuthAccountInfo } from '../domain/types';

function toAccountInfo(user: User | null): AuthAccountInfo | null {
	if (!user) return null;
	const googleProfile = user.providerData.find((entry) => entry?.providerId === GoogleAuthProvider.PROVIDER_ID);
	return {
		uid: user.uid,
		authProvider: 'google',
		googleEmail: googleProfile?.email ?? user.email ?? '',
		googleDisplayName: googleProfile?.displayName ?? user.displayName ?? '',
		isAnonymous: false,
	};
}

export function getCurrentAccountInfo(): AuthAccountInfo | null {
	return toAccountInfo(getFirebaseAuth().currentUser);
}

export async function waitForExistingSession(): Promise<AuthAccountInfo | null> {
	await waitForInitialAuthState();
	return getCurrentAccountInfo();
}

export async function signInWithCanonicalCustomToken(customToken: string): Promise<AuthAccountInfo> {
	const credential = await signInWithCustomToken(getFirebaseAuth(), customToken);
	return (
		toAccountInfo(credential.user) ?? {
			uid: credential.user.uid,
			authProvider: 'google',
			googleEmail: '',
			googleDisplayName: '',
			isAnonymous: false,
		}
	);
}

export async function signOutFirebase(): Promise<void> {
	await signOut(getFirebaseAuth());
}

export function observeAccountInfo(onValue: (account: AuthAccountInfo | null) => void): () => void {
	return subscribeToAuthState((user) => onValue(toAccountInfo(user)));
}
