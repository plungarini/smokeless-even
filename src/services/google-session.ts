/**
 * Google-mode persistent session plumbing.
 *
 * PLAN 4 wires up the GitHub Pages → WebView handoff (see docs/auth-flow.md
 * once added). PLAN 6 wires the refresh loop that lets the user stay
 * signed in for weeks/months without re-doing Google sign-in.
 *
 * For now this file exposes a stub so bootstrap can compile. The stub
 * returns `false` which tells bootstrap to surface "session expired" and
 * send the user back to the onboarding flow — a safe default until the
 * real re-auth path is wired up.
 */

import { httpsCallable } from 'firebase/functions';
import { getFirebaseFunctions } from '../lib/firebase';
import { signInWithCanonicalCustomToken } from './auth';
import { bridgeStorageGet, bridgeStorageRemove, bridgeStorageSet } from './bridge-storage';

const SESSION_POINTER_KEY = 'smokeless:google-session';

export interface StoredGoogleSession {
	// The Firebase UID this session belongs to. Used for sanity checks and
	// as the key the server uses to mint fresh custom tokens.
	firebaseUid: string;
	// Server-issued rotating handle. The Cloud Function validates this
	// against a Firestore doc, then mints a fresh custom token. Kept out
	// of IndexedDB on purpose (IndexedDB is wiped on WebView refresh).
	sessionToken: string;
	// When the handle itself expires. We rotate proactively well before.
	expiresAt: string;
}

export async function readStoredGoogleSession(): Promise<StoredGoogleSession | null> {
	const raw = await bridgeStorageGet(SESSION_POINTER_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as Partial<StoredGoogleSession>;
		if (!parsed.firebaseUid || !parsed.sessionToken || !parsed.expiresAt) return null;
		return parsed as StoredGoogleSession;
	} catch {
		return null;
	}
}

export async function writeStoredGoogleSession(session: StoredGoogleSession): Promise<void> {
	await bridgeStorageSet(SESSION_POINTER_KEY, JSON.stringify(session));
}

export async function clearStoredGoogleSession(): Promise<void> {
	await bridgeStorageRemove(SESSION_POINTER_KEY);
}

interface ExchangeSessionTokenResponse {
	customToken: string;
	firebaseUid: string;
	// Next-generation session token — replaces the one we just presented
	// so a leaked token can't be used twice.
	nextSessionToken: string;
	nextExpiresAt: string;
}

/**
 * Attempt to silently re-authenticate with Firebase using a Smokeless
 * session pointer stored in Bridge Local Storage. Returns true on success,
 * false if the stored pointer is missing, expired, or rejected by the
 * server — in which case the caller should route the user back to the
 * onboarding flow to re-do Google sign-in.
 *
 * The server rotates the session token on each successful exchange, so a
 * stored token is single-use. If the device is ever restored from a
 * snapshot the old token will be rejected and the user re-onboards.
 */
export async function tryReauthWithStoredGoogleSession(): Promise<boolean> {
	const stored = await readStoredGoogleSession();
	if (!stored) return false;

	const expiresAtMs = Date.parse(stored.expiresAt);
	if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
		await clearStoredGoogleSession();
		return false;
	}

	try {
		const call = httpsCallable<
			{ firebaseUid: string; sessionToken: string },
			ExchangeSessionTokenResponse
		>(getFirebaseFunctions(), 'exchangeGoogleSessionToken');
		const { data } = await call({
			firebaseUid: stored.firebaseUid,
			sessionToken: stored.sessionToken,
		});
		await signInWithCanonicalCustomToken(data.customToken);
		await writeStoredGoogleSession({
			firebaseUid: data.firebaseUid,
			sessionToken: data.nextSessionToken,
			expiresAt: data.nextExpiresAt,
		});
		return true;
	} catch (error) {
		console.warn('[google-session] exchange failed', error);
		await clearStoredGoogleSession();
		return false;
	}
}
