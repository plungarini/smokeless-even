import { EvenAppMethod, waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { missingClientEnv } from '../config/env';
import type { AuthAccountInfo, EvenUserInfo, UserDocument } from '../domain/types';
import { toDayKey } from '../lib/time';
import { normalizeEvenUserInfo } from '../lib/even';
import { ensureFirebaseSession, getCurrentAccountInfo, observeAccountInfo } from '../services/auth';
import {
	ensureCanonicalUserData,
	fetchUserDocument,
	subscribeToTodayCount,
	subscribeToUserDocument,
	upsertAuthProviderFields,
} from '../services/firestore';
import { refreshLogs } from './refresh-logs';
import {
	clearGooglePairingSession,
	loadActiveGooglePairingAsync,
	refreshGooglePairingStatus,
} from '../services/google-link';
import { appStore } from './store';

// ── Module-scoped lifecycle state ───────────────────────────────────
//
// These survive React component remounts because they live at module scope.
// HMR full-reload (via the `evenHudFullReload` Vite plugin) is the only thing
// that resets them, which is exactly what we want: the Even bridge resets in
// lockstep on full-reload, so our bootstrap state tracks reality.

let bootstrapPromise: Promise<void> | null = null;
let unsubscribers: Array<() => void> = [];
let authObserverUnsub: (() => void) | null = null;
let clockTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Start (or return the cached) bootstrap. Safe to call multiple times from
 * any entry point (React or glasses) — the first call wins.
 */
export function startBootstrap(): Promise<void> {
	if (bootstrapPromise) return bootstrapPromise;
	bootstrapPromise = runBootstrap();
	return bootstrapPromise;
}

/**
 * Reboot the whole pipeline for a new canonical UID (e.g. after Google-link
 * switches the signed-in account). Tears down existing subscriptions, resets
 * the store, and re-runs bootstrap against the new UID.
 */
export async function rebootForUid(): Promise<void> {
	teardownSubscriptions();
	appStore.resetForReboot();
	appStore.setPhase('booting');
	bootstrapPromise = runBootstrap();
	return bootstrapPromise;
}

async function runBootstrap(): Promise<void> {
	if (missingClientEnv.length > 0) {
		appStore.setPhase(
			'blocked',
			`Missing web config: ${missingClientEnv.join(', ')}`,
			`missing-env:${missingClientEnv.join(',')}`,
		);
		return;
	}

	try {
		const bridge = await waitForEvenAppBridge();
		const rawUser = typeof bridge.getUserInfo === 'function'
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

		// Existing subs from a previous bootstrap must be torn down before we
		// attach a new set — otherwise rebootForUid() leaks listeners.
		teardownSubscriptions();

		const firebaseUid = await ensureFirebaseSession();
		const activeAccount = getCurrentAccountInfo();
		let activePairing = await loadActiveGooglePairingAsync(firebaseUid);
		if (activePairing) {
			activePairing = await refreshGooglePairingStatus(activePairing, firebaseUid);
		}
		appStore.setGoogleLinkSession(activePairing);

		appStore.setAccountInfo(activeAccount);
		appStore.setCanonicalUid(firebaseUid);

		await ensureCanonicalUserData(firebaseUid, normalized);
		if (activeAccount) await upsertAuthProviderFields(firebaseUid, activeAccount);

		const existingDocument = await fetchUserDocument(firebaseUid);
		appStore.setUserDocument(existingDocument ?? buildMinimalDocument(normalized));

		attachFirestoreSubscriptions(firebaseUid);
		startAuthObserver();
		startDayRolloverTimer();

		appStore.setBootstrapError(null);
		appStore.setPhase('ready');

		await refreshLogs(firebaseUid);

		if (activePairing && isTerminalGoogleLinkStatus(activePairing.status)) {
			clearGooglePairingSession(activePairing);
			appStore.setGoogleLinkSession(null);
		}
	} catch (error) {
		console.error('[Smokeless] bootstrap failed', error);
		appStore.setPhase('blocked', 'Smokeless could not finish startup. Please restart the app.');
		if (error instanceof Error) {
			const code = 'code' in error && typeof (error as { code?: unknown }).code === 'string' ? (error as { code: string }).code : '';
			appStore.setBootstrapError(code ? `${code}: ${error.message}` : error.message);
		} else {
			appStore.setBootstrapError(String(error));
		}
	}
}

function attachFirestoreSubscriptions(uid: string): void {
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

		console.info('[Smokeless] auth uid changed', { prevUid, nextUid });
		appStore.setAccountInfo(nextAccount);
		appStore.setCanonicalUid(nextUid);
		void rebootForUid();
	});
}

/**
 * Watch for midnight rollover so day-scoped selectors (today count, "today"
 * indicator, etc.) transition without a manual refresh. Runs at a 1-minute
 * cadence which is sufficient granularity for a day boundary.
 */
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
		preferences: {
			locale: 'en',
			themeMode: 'dark',
			weekStart: 'Monday',
		},
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

function isTerminalGoogleLinkStatus(status: string): boolean {
	return status === 'consumed' || status === 'expired' || status === 'cancelled' || status === 'failed';
}

// Re-export helper so App.tsx / hooks can keep local checks consistent.
export { isTerminalGoogleLinkStatus };

// Re-export type so hooks don't need a separate import from services.
export type { AuthAccountInfo };
