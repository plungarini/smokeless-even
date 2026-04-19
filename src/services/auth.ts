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
export interface RestoreSessionOutcome {
	restored: boolean;
	fatalErrorCode?: 'custom-token-mint-failed' | 'lookup-failed';
	fatalErrorMessage?: string;
}

interface ResolveEvenSessionResponse {
	customToken: string | null;
	firebaseUid: string | null;
	errorCode?: 'no-mapping' | 'custom-token-mint-failed' | 'lookup-failed';
	errorMessage?: string;
}

export async function tryRestoreSessionFromEvenUid(evenUid: string): Promise<RestoreSessionOutcome> {
	await waitForInitialAuthState();
	if (auth.currentUser) return { restored: true };

	let result: { data: ResolveEvenSessionResponse };
	try {
		const resolve = httpsCallable<{ evenUid: string }, ResolveEvenSessionResponse>(
			functions,
			'resolveEvenSession',
		);
		result = await resolve({ evenUid });
	} catch (error) {
		// Network / transport failure — non-fatal, caller falls back to anonymous.
		console.error('[Auth] resolveEvenSession transport error', error);
		return { restored: false };
	}

	const { customToken, errorCode, errorMessage } = result.data ?? {};

	// A mint failure means the mapping exists but IAM blocks token creation.
	// This is the exact condition that produces duplicate accounts, so we
	// surface it loudly instead of falling through to anonymous sign-in.
	if (errorCode === 'custom-token-mint-failed') {
		console.error('[Auth] resolveEvenSession: token mint blocked by IAM', { evenUid, errorMessage });
		return {
			restored: false,
			fatalErrorCode: 'custom-token-mint-failed',
			fatalErrorMessage: errorMessage ?? 'Firebase custom-token minting is blocked. Check Functions IAM (Service Account Token Creator).',
		};
	}

	if (errorCode === 'lookup-failed') {
		console.error('[Auth] resolveEvenSession: index lookup failed', { evenUid, errorMessage });
		return {
			restored: false,
			fatalErrorCode: 'lookup-failed',
			fatalErrorMessage: errorMessage ?? 'Could not read the Even UID index.',
		};
	}

	if (customToken) {
		try {
			await signInWithCustomToken(auth, customToken);
			console.info('[Auth] restored session via Even UID index', { evenUid });
			return { restored: true };
		} catch (error) {
			console.error('[Auth] signInWithCustomToken failed', error);
			return { restored: false };
		}
	}

	// No mapping yet — caller will sign in anonymously, which is correct for a
	// first-ever boot on this device.
	return { restored: false };
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
