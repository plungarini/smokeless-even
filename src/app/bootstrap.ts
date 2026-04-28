import { EvenAppMethod, waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { missingClientEnv } from '../config/env';
import type { AuthAccountInfo, EvenUserInfo, UserDocument } from '../domain/types';
import { toDayKey } from '../lib/time';
import { normalizeEvenUserInfo } from '../lib/even';
import {
	getCurrentAccountInfo,
	observeAccountInfo,
	signOutFirebase,
	waitForExistingSession,
} from '../services/auth';
import {
	ensureCanonicalUserData,
	fetchLastLogEntry,
	fetchUserDocument,
	subscribeToTodayCount,
	subscribeToUserDocument,
	upsertAuthProviderFields,
} from '../services/db.service';
// refreshLogs is no longer called on startup — stats/history are fetched
// on-demand when the user navigates to those tabs.
import {
	readStoredAuthMode,
	writeStoredAuthMode,
	clearStoredAuthMode,
	type AuthMode,
} from '../services/auth-mode';
import { clearStoredGoogleSession, tryReauthWithStoredGoogleSession } from '../services/google-session';
import { appStore } from './store';

// ── Module-scoped lifecycle state ───────────────────────────────────

let bootstrapPromise: Promise<void> | null = null;
let unsubscribers: Array<() => void> = [];
let authObserverUnsub: (() => void) | null = null;
let clockTimer: ReturnType<typeof setInterval> | null = null;

export function startBootstrap(): Promise<void> {
	if (bootstrapPromise) return bootstrapPromise;
	bootstrapPromise = runBootstrap();
	return bootstrapPromise;
}

export async function rebootForUid(): Promise<void> {
	teardownSubscriptions();
	appStore.resetForReboot();
	appStore.setPhase('booting');
	bootstrapPromise = runBootstrap();
	return bootstrapPromise;
}

/**
 * Called by the onboarding UI when the user picks an auth mode. Persists
 * the choice via Bridge Local Storage and re-runs bootstrap end-to-end.
 */
export async function completeOnboarding(mode: AuthMode): Promise<void> {
	await writeStoredAuthMode(mode);
	appStore.setAuthMode(mode);
	teardownSubscriptions();
	appStore.setPhase('booting');
	bootstrapPromise = runBootstrap();
	return bootstrapPromise;
}

/**
 * Called from Settings "sign out" / "delete all". Clears the stored mode
 * so the onboarding screen re-appears on next boot, and tears down any
 * Firebase session.
 */
export async function resetAuthMode(): Promise<void> {
	teardownSubscriptions();
	await clearStoredAuthMode();
	await clearStoredGoogleSession();
	try {
		await signOutFirebase();
	} catch {
		// No-op — Local mode never signed in, and Firebase may not be initialized.
	}
	appStore.setAuthMode(null);
	appStore.setAccountInfo(null);
	appStore.setCanonicalUid(null);
	appStore.setUserDocument(null);
	appStore.setPhase('onboarding');
	bootstrapPromise = null;
}

/** Firebase auth init can hang when IndexedDB is wiped or slow in the WebView.
 * Cap the wait so we can fall back to our stored-session Cloud Function path. */
async function waitForExistingSessionWithTimeout(timeoutMs = 2500): Promise<AuthAccountInfo | null> {
	return Promise.race([
		waitForExistingSession(),
		new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
	]);
}

async function runBootstrap(): Promise<void> {
	try {
		const bridge = await waitForEvenAppBridge();
		const rawUser =
			typeof bridge.getUserInfo === 'function'
				? await bridge.getUserInfo()
				: await bridge.callEvenApp(EvenAppMethod.GetUserInfo);
		const normalized = normalizeEvenUserInfo(rawUser);
		if (!normalized) {
			appStore.setPhase(
				'blocked',
				'Unable to connect to Even. Please restart the app.',
				'even-user:normalize-failed',
			);
			return;
		}

		appStore.setEvenUser(normalized);

		// ── Auth mode gate ────────────────────────────────────────────
		const storedMode = await readStoredAuthMode();
		if (!storedMode) {
			appStore.setAuthMode(null);
			appStore.setPhase('onboarding');
			return;
		}
		appStore.setAuthMode(storedMode);

		if (storedMode === 'google' && missingClientEnv.length > 0) {
			appStore.setPhase(
				'blocked',
				`Missing Firebase config: ${missingClientEnv.join(', ')}`,
				`missing-env:${missingClientEnv.join(',')}`,
			);
			return;
		}

		teardownSubscriptions();

		// ── Mode-specific identity ────────────────────────────────────
		let canonicalUid: string;
		let activeAccount: AuthAccountInfo | null;

		if (storedMode === 'local') {
			// Local mode: identity is the Even UID. No Firebase involvement.
			canonicalUid = normalized.uid;
			activeAccount = {
				uid: normalized.uid,
				authProvider: 'local',
				googleEmail: '',
				googleDisplayName: '',
				isAnonymous: false,
			};
		} else {
			// Google mode: Bridge Local Storage is the ONLY durable persistence
			// inside the Even Hub WebView (IndexedDB is wiped on restart).
			// We therefore try our Cloud Function re-auth path FIRST. Only if
			// there is no Bridge token do we fall back to the flaky IndexedDB
			// path as a last resort.
			const reauthResult = await tryReauthWithStoredGoogleSession();
			if (reauthResult.ok) {
				activeAccount = getCurrentAccountInfo();
			} else if (reauthResult.reason === 'network') {
				// The Bridge token is still present but we couldn't reach the
				// server (flaky connection, CF cold start, etc.). Tell the user
				// to check their connection rather than forcing a re-auth.
				appStore.setPhase(
					'blocked',
					'Could not connect to Google. Check your connection and try again.',
					'google-session:network',
				);
				return;
			} else {
				// Bridge token missing, expired, or definitively rejected.
				// Try IndexedDB as a last-ditch fallback (rare case where Bridge
				// was wiped but IndexedDB miraculously survived).
				const existing = await waitForExistingSessionWithTimeout(2000);
				if (existing) {
					activeAccount = existing;
				} else {
					appStore.setPhase(
						'blocked',
						'Your Google session expired. Sign in again to continue.',
						'google-session:expired',
					);
					return;
				}
			}
			if (!activeAccount) {
				appStore.setPhase('blocked', 'Could not read Google session.', 'google-session:missing');
				return;
			}
			canonicalUid = activeAccount.uid;
		}

		// Only block on reads that provide display data for the home screen.
		// Firestore writes (ensureCanonicalUserData, upsertAuthProviderFields)
		// are non-critical metadata updates — run them in the background so
		// the UI surfaces immediately.
		const [existingDocument, lastEntry] = await Promise.all([
			fetchUserDocument(canonicalUid),
			fetchLastLogEntry(canonicalUid),
		]);

		appStore.setLastSmokeAt(lastEntry?.timestamp ?? null);
		appStore.setAccountInfo(activeAccount);
		appStore.setCanonicalUid(canonicalUid);
		appStore.setUserDocument(existingDocument ?? buildMinimalDocument(normalized));

		attachSubscriptions(canonicalUid);
		if (storedMode === 'google') startAuthObserver();
		startDayRolloverTimer();

		appStore.setBootstrapError(null);
		appStore.setPhase('ready');

		// Non-blocking metadata writes and log refresh.
		void Promise.all([
			ensureCanonicalUserData(canonicalUid, normalized),
			upsertAuthProviderFields(canonicalUid, activeAccount),
		]).catch((error) => {
			console.warn('[Smokeless] background user-data write failed', error);
		});
	} catch (error) {
		console.error('[Smokeless] bootstrap failed', error);
		appStore.setPhase('blocked', 'Smokeless could not finish startup. Please restart the app.');
		if (error instanceof Error) {
			const code =
				'code' in error && typeof (error as { code?: unknown }).code === 'string'
					? (error as { code: string }).code
					: '';
			appStore.setBootstrapError(code ? `${code}: ${error.message}` : error.message);
		} else {
			appStore.setBootstrapError(String(error));
		}
	}
}

function attachSubscriptions(uid: string): void {
	unsubscribers.push(
		subscribeToUserDocument(uid, (doc) => {
			if (doc) appStore.setUserDocument(doc);
		}),
	);
	unsubscribers.push(
		subscribeToTodayCount(uid, (count) => {
			appStore.setTodayCount(count);
		}),
	);
}

function startAuthObserver(): void {
	if (authObserverUnsub) return;
	authObserverUnsub = observeAccountInfo((nextAccount) => {
		const nextUid = nextAccount?.uid ?? null;
		const prevUid = appStore.getState().canonicalUid;
		if (!nextUid || !prevUid || nextUid === prevUid) return;
		console.info('[Smokeless] firebase uid changed', { prevUid, nextUid });
		appStore.setAccountInfo(nextAccount);
		appStore.setCanonicalUid(nextUid);
		void rebootForUid();
	});
}

function startDayRolloverTimer(): void {
	if (clockTimer) return;
	clockTimer = setInterval(() => {
		const nextDay = toDayKey(new Date());
		if (nextDay !== appStore.getState().today) {
			appStore.setToday(nextDay);
		}
	}, 60_000);
}

function teardownSubscriptions(): void {
	for (const unsub of unsubscribers) {
		try {
			unsub();
		} catch (error) {
			console.warn('[Smokeless] unsubscribe failed', error);
		}
	}
	unsubscribers = [];
}

function buildMinimalDocument(even: EvenUserInfo): UserDocument {
	return {
		createdAt: null,
		updatedAt: null,
		longestEverCessation: 0,
		todayMaxCessation: null,
		preferences: { locale: 'en', themeMode: 'dark', weekStart: 'Monday' },
		providers: {
			google: null,
			even: {
				uid: even.uid,
				name: even.name,
				avatar: even.avatar,
				country: even.country,
				linkedAt: null,
			},
		},
	};
}

export type { AuthAccountInfo };
