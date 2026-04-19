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
	fetchUserDocument,
	subscribeToTodayCount,
	subscribeToUserDocument,
	upsertAuthProviderFields,
} from '../services/db.service';
import { refreshLogs } from './refresh-logs';
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
			// Google mode: rely on Firebase-persisted session first; fall back
			// to the Smokeless-managed re-auth (custom token minted from a
			// stored session pointer) before asking the user to re-sign-in.
			const existing = await waitForExistingSession();
			if (existing) {
				activeAccount = existing;
			} else {
				const reauthed = await tryReauthWithStoredGoogleSession();
				if (!reauthed) {
					// No session recoverable — kick back to onboarding so the
					// UI can re-invite the user through the GitHub Pages flow.
					appStore.setPhase(
						'blocked',
						'Your Google session expired. Sign in again to continue.',
						'google-session:expired',
					);
					return;
				}
				activeAccount = getCurrentAccountInfo();
			}
			if (!activeAccount) {
				appStore.setPhase('blocked', 'Could not read Google session.', 'google-session:missing');
				return;
			}
			canonicalUid = activeAccount.uid;
		}

		const [existingDocument] = await Promise.all([
			fetchUserDocument(canonicalUid),
			ensureCanonicalUserData(canonicalUid, normalized),
			upsertAuthProviderFields(canonicalUid, activeAccount),
		]);

		appStore.setAccountInfo(activeAccount);
		appStore.setCanonicalUid(canonicalUid);
		appStore.setUserDocument(existingDocument ?? buildMinimalDocument(normalized));

		attachSubscriptions(canonicalUid);
		if (storedMode === 'google') startAuthObserver();
		startDayRolloverTimer();

		appStore.setBootstrapError(null);
		appStore.setPhase('ready');

		await refreshLogs(canonicalUid);
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
