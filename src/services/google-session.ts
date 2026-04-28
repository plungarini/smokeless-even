/**
 * Google-mode persistent session plumbing.
 *
 * PLAN 4 wires up the GitHub Pages → WebView handoff.
 * PLAN 6 wires the refresh loop that lets the user stay signed in for
 * months/years without re-doing Google Sign-In.
 *
 * Key design decisions:
 * 1. Bridge Local Storage is the only durable persistence layer inside
 *    the Even Hub WebView (browser localStorage/IndexedDB are wiped on
 *    restart). All session tokens MUST live here.
 * 2. We write the NEW rotated token to Bridge BEFORE calling Firebase
 *    signInWithCustomToken. If the app/WebView crashes after the server
 *    rotates but before Firebase finishes, the new token is already
 *    persisted and the next boot uses it directly.
 * 3. The server keeps a two-token grace window (current + previous). If
 *    the client crashes before writing the new token, the old token is
 *    still accepted for exactly one more exchange.
 * 4. We retry transient network errors (up to 3 attempts) and ONLY clear
 *    Bridge storage on definitive auth failures (invalid token, expired
 *    session, missing doc). A flaky connection must not log the user out.
 */

import { httpsCallable } from 'firebase/functions';
import { getFirebaseFunctions } from '../lib/firebase';
import { signInWithCanonicalCustomToken } from './auth';
import { bridgeStorageGet, bridgeStorageRemove, bridgeStorageSet } from './bridge-storage';

const SESSION_POINTER_KEY = 'smokeless:google-session';

export interface StoredGoogleSession {
	// The Firebase UID this session belongs to.
	firebaseUid: string;
	// Server-issued rotating handle.
	sessionToken: string;
	// When the handle itself expires (server-side TTL, 365 days rolling).
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
	nextSessionToken: string;
	nextExpiresAt: string;
}

export type ReauthResult =
	| { ok: true }
	| { ok: false; reason: 'missing' | 'expired' | 'network' | 'invalid' };

const DEFINITIVE_ERROR_CODES = new Set([
	'permission-denied',
	'not-found',
	'failed-precondition',
	'invalid-argument',
	'unauthenticated',
]);

function extractCallableErrorCode(error: unknown): string {
	if (error && typeof error === 'object' && 'code' in error) {
		const code = (error as { code: unknown }).code;
		if (typeof code === 'string') return code;
	}
	return 'unknown';
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Attempt to silently re-authenticate with Firebase using a Smokeless
 * session pointer stored in Bridge Local Storage.
 *
 * Returns a discriminated result so callers can distinguish:
 * - 'missing'  → no stored session (user never signed in or Bridge was wiped)
 * - 'expired'  → stored session passed its client-side expiresAt
 * - 'network'  → transient failure (token kept, retry next boot)
 * - 'invalid'  → definitive server rejection (token cleared, user must re-auth)
 */
export async function tryReauthWithStoredGoogleSession(): Promise<ReauthResult> {
	const stored = await readStoredGoogleSession();
	if (!stored) return { ok: false, reason: 'missing' };

	const expiresAtMs = Date.parse(stored.expiresAt);
	if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
		await clearStoredGoogleSession();
		return { ok: false, reason: 'expired' };
	}

	// Attempt exchange with limited retries for transient errors.
	// We keep this tight: 2 attempts total, 500ms delay between them.
	// A Cloud Function cold start is typically 1-2s; adding retries on
	// top of that makes startup feel sluggish.
	let exchangeData: ExchangeSessionTokenResponse | null = null;
	let lastError: unknown = null;

	for (let attempt = 0; attempt < 2; attempt++) {
		if (attempt > 0) {
			await delay(500); // 0ms, 500ms between attempts
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
			exchangeData = data;
			break;
		} catch (error) {
			lastError = error;
			const code = extractCallableErrorCode(error);
			if (DEFINITIVE_ERROR_CODES.has(code)) {
				// Server explicitly rejected the token — do NOT retry.
				await clearStoredGoogleSession();
				return { ok: false, reason: 'invalid' };
			}
			// Transient error — loop and retry (up to 3 total attempts).
		}
	}

	if (!exchangeData) {
		console.warn('[google-session] exchange failed after retries', lastError);
		// Token is still in Bridge — next boot will retry automatically.
		return { ok: false, reason: 'network' };
	}

	// CRITICAL: persist the NEW token BEFORE Firebase sign-in. If the
	// WebView is killed right here, the next boot already has the new token.
	await writeStoredGoogleSession({
		firebaseUid: exchangeData.firebaseUid,
		sessionToken: exchangeData.nextSessionToken,
		expiresAt: exchangeData.nextExpiresAt,
	});

	try {
		await signInWithCanonicalCustomToken(exchangeData.customToken);
	} catch (error) {
		console.warn('[google-session] signInWithCustomToken failed', error);
		// The new session token is already persisted. Next boot will try
		// again with the same token (the server will mint a fresh custom
		// token). Treat this as a transient failure so the user is NOT
		// forced to re-auth manually.
		return { ok: false, reason: 'network' };
	}

	return { ok: true };
}
