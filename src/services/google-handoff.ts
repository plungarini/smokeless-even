/**
 * Google sign-in handoff between the WebView and the GitHub Pages link site.
 *
 * Firebase Auth's authorized-domain restriction means Google Sign-In must
 * happen OUTSIDE the Even Hub WebView — the GitHub Pages site is on an
 * authorized domain. We bridge the two with a short-lived one-time code
 * stored in Firestore at `handoffCodes/{code}`.
 *
 * ┌─────────────────────────────┐          ┌────────────────────────────┐
 * │  WebView (onboarding)       │          │  GitHub Pages link site    │
 * │                             │          │                            │
 * │ 1. createHandoffCode()      │          │                            │
 * │    → { code, linkUrl }      │          │                            │
 * │ 2. open linkUrl in browser  │─────────▶│ 3. user arrives ?code=XYZ  │
 * │ 4. poll exchangeHandoff(c)  │          │ 4. Google Sign-In (popup)  │
 * │    every 2s                 │          │ 5. authorizeHandoff(c)     │
 * │                             │          │ 6. "Return to glasses"     │
 * │ 7. receives { customToken,  │◀─────────│                            │
 * │    sessionToken }           │          │                            │
 * │ 8. signInWithCustomToken    │          │                            │
 * │ 9. store sessionToken in    │          │                            │
 * │    Bridge Local Storage     │          │                            │
 * │ 10. completeOnboarding()    │          │                            │
 * └─────────────────────────────┘          └────────────────────────────┘
 *
 * All three Cloud Functions (`createHandoffCode`, `authorizeHandoffCode`,
 * `exchangeHandoffCode`) are wired up in Plan 7. The shapes below are the
 * contract.
 */

import { httpsCallable } from 'firebase/functions';
import { env } from '../config/env';
import { getFirebaseFunctions } from '../lib/firebase';
import { signInWithCanonicalCustomToken } from './auth';
import { writeStoredGoogleSession } from './google-session';

export interface CreateHandoffCodeResponse {
	code: string;
	linkUrl: string;
	expiresAt: string; // ISO
}

export interface ExchangeHandoffCodeResponse {
	status: 'pending' | 'authorized' | 'expired' | 'cancelled';
	// Present only when status === 'authorized':
	customToken?: string;
	firebaseUid?: string;
	sessionToken?: string;
	sessionExpiresAt?: string; // ISO
}

export interface AuthorizeHandoffCodeResponse {
	ok: true;
}

export async function createHandoffCode(input: { evenUid: string }): Promise<CreateHandoffCodeResponse> {
	const call = httpsCallable<{ evenUid: string }, CreateHandoffCodeResponse>(
		getFirebaseFunctions(),
		'createHandoffCode',
	);
	const { data } = await call(input);
	return data;
}

export async function exchangeHandoffCode(code: string): Promise<ExchangeHandoffCodeResponse> {
	const call = httpsCallable<{ code: string }, ExchangeHandoffCodeResponse>(
		getFirebaseFunctions(),
		'exchangeHandoffCode',
	);
	const { data } = await call({ code });
	return data;
}

export async function authorizeHandoffCode(code: string): Promise<AuthorizeHandoffCodeResponse> {
	const call = httpsCallable<{ code: string }, AuthorizeHandoffCodeResponse>(
		getFirebaseFunctions(),
		'authorizeHandoffCode',
	);
	const { data } = await call({ code });
	return data;
}

// ── WebView-side orchestrator ─────────────────────────────────────

export interface GoogleHandoffOptions {
	onCode: (code: string, linkUrl: string) => void;
	signal?: AbortSignal;
	pollIntervalMs?: number;
	// Maximum total wait time before giving up — 10 minutes default.
	timeoutMs?: number;
}

export interface GoogleHandoffResult {
	firebaseUid: string;
	customToken: string;
	sessionToken: string;
	sessionExpiresAt: string;
}

/**
 * Drives the full handoff on the WebView side: creates the code, opens
 * the link URL externally, polls for authorization, then signs the user
 * in via custom token and persists the session pointer. Resolves once
 * the user is fully signed in; rejects on timeout / cancel / CF error.
 */
export async function runGoogleHandoff(evenUid: string, opts: GoogleHandoffOptions): Promise<GoogleHandoffResult> {
	const { code, linkUrl, expiresAt } = await createHandoffCode({ evenUid });
	opts.onCode(code, linkUrl);

	// Nudge the OS to open the link site externally. The Even Hub WebView
	// typically routes `_blank` through the phone's default browser — if
	// that fails the user can still copy/paste the URL manually.
	try {
		window.open(linkUrl, '_blank', 'noopener,noreferrer');
	} catch {
		// Non-fatal — user has the code/URL visible in the UI either way.
	}

	const pollInterval = opts.pollIntervalMs ?? 2000;
	const timeoutMs = opts.timeoutMs ?? 10 * 60 * 1000;
	const deadlineMs = Math.min(Date.parse(expiresAt) || Date.now() + timeoutMs, Date.now() + timeoutMs);

	while (Date.now() < deadlineMs) {
		if (opts.signal?.aborted) throw new Error('cancelled');
		const result = await exchangeHandoffCode(code);
		if (result.status === 'authorized' && result.customToken && result.firebaseUid && result.sessionToken && result.sessionExpiresAt) {
			await signInWithCanonicalCustomToken(result.customToken);
			await writeStoredGoogleSession({
				firebaseUid: result.firebaseUid,
				sessionToken: result.sessionToken,
				expiresAt: result.sessionExpiresAt,
			});
			return {
				firebaseUid: result.firebaseUid,
				customToken: result.customToken,
				sessionToken: result.sessionToken,
				sessionExpiresAt: result.sessionExpiresAt,
			};
		}
		if (result.status === 'expired') throw new Error('handoff-expired');
		if (result.status === 'cancelled') throw new Error('handoff-cancelled');
		await delay(pollInterval, opts.signal);
	}
	throw new Error('handoff-timeout');
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			signal?.removeEventListener('abort', onAbort);
			resolve();
		}, ms);
		const onAbort = () => {
			clearTimeout(timer);
			reject(new Error('cancelled'));
		};
		signal?.addEventListener('abort', onAbort);
	});
}

export function getLinkSiteBaseUrl(): string {
	return env.linkSiteUrl;
}
