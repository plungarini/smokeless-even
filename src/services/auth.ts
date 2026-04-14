import {
	GoogleAuthProvider,
	type AuthError,
	getRedirectResult,
	linkWithRedirect,
	signInAnonymously,
	signInWithCredential,
	type User,
} from 'firebase/auth';
import { auth, waitForInitialAuthState } from '../lib/firebase';
import type { AuthAccountInfo } from '../domain/types';

const GOOGLE_LINK_STORAGE_KEY = 'smokeless:pending-google-link';

interface PendingGoogleLink {
	intent: 'google-link';
	sourceUid: string;
	createdAt: number;
}

export interface GoogleRedirectResolution {
	activeUid: string | null;
	mergedFromUid: string | null;
	account: AuthAccountInfo | null;
}

function readPendingGoogleLink(): PendingGoogleLink | null {
	if (typeof window === 'undefined') return null;

	try {
		const raw = window.sessionStorage.getItem(GOOGLE_LINK_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<PendingGoogleLink>;
		if (parsed.intent !== 'google-link' || typeof parsed.sourceUid !== 'string' || !parsed.sourceUid) {
			return null;
		}
		return {
			intent: 'google-link',
			sourceUid: parsed.sourceUid,
			createdAt: Number(parsed.createdAt ?? Date.now()),
		};
	} catch {
		return null;
	}
}

function writePendingGoogleLink(sourceUid: string): void {
	if (typeof window === 'undefined') return;
	window.sessionStorage.setItem(
		GOOGLE_LINK_STORAGE_KEY,
		JSON.stringify({
			intent: 'google-link',
			sourceUid,
			createdAt: Date.now(),
		} satisfies PendingGoogleLink),
	);
}

function clearPendingGoogleLink(): void {
	if (typeof window === 'undefined') return;
	window.sessionStorage.removeItem(GOOGLE_LINK_STORAGE_KEY);
}

function isRecoverableRedirectError(code: string | undefined): boolean {
	return code === 'auth/operation-not-supported-in-this-environment' || code === 'auth/web-storage-unsupported' || code === 'auth/internal-error';
}

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

export async function startGoogleLinkRedirect(): Promise<void> {
	await waitForInitialAuthState();

	const currentUser = auth.currentUser;
	if (!currentUser) {
		throw new Error('No Firebase user available for Google linking.');
	}

	const alreadyLinked = currentUser.providerData.some((entry) => entry?.providerId === GoogleAuthProvider.PROVIDER_ID);
	if (alreadyLinked) {
		return;
	}

	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({
		prompt: 'select_account',
	});

	writePendingGoogleLink(currentUser.uid);
	await linkWithRedirect(currentUser, provider);
}

export async function resolveGoogleLinkRedirect(): Promise<GoogleRedirectResolution> {
	await waitForInitialAuthState();

	const pending = readPendingGoogleLink();

	try {
		const result = await getRedirectResult(auth);
		const activeUser = result?.user ?? auth.currentUser;

		if (!result && !pending) {
			return {
				activeUid: activeUser?.uid ?? null,
				mergedFromUid: null,
				account: toAccountInfo(activeUser),
			};
		}

		clearPendingGoogleLink();

		return {
			activeUid: activeUser?.uid ?? null,
			mergedFromUid: pending && activeUser?.uid && pending.sourceUid !== activeUser.uid ? pending.sourceUid : null,
			account: toAccountInfo(activeUser),
		};
	} catch (error) {
		const authError = error as AuthError;
		const credential = GoogleAuthProvider.credentialFromError(authError);

		if (pending && credential) {
			const result = await signInWithCredential(auth, credential);
			clearPendingGoogleLink();
			return {
				activeUid: result.user.uid,
				mergedFromUid: pending.sourceUid !== result.user.uid ? pending.sourceUid : null,
				account: toAccountInfo(result.user),
			};
		}

		if (!pending && isRecoverableRedirectError(authError.code)) {
			clearPendingGoogleLink();
			return {
				activeUid: auth.currentUser?.uid ?? null,
				mergedFromUid: null,
				account: toAccountInfo(auth.currentUser),
			};
		}

		clearPendingGoogleLink();
		throw error;
	}
}
