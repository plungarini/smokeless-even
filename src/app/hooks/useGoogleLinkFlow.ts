import { startTransition, useCallback, useEffect, useEffectEvent, useRef } from 'react';
import type { GoogleLinkPairingSession } from '../../domain/types';
import { ensureFirebaseSession } from '../../services/auth';
import {
	canRetryGoogleLinkClaim,
	claimReadyGooglePairing,
	clearGooglePairingSession,
	completeGoogleLinkCleanup,
	isGoogleLinkNotFoundError,
	isSameGoogleLinkSession,
	loadGoogleLinkClaimStateAsync,
	startGooglePairing,
	watchGooglePairingStatus,
} from '../../services/google-link';
import { rebootForUid, isTerminalGoogleLinkStatus } from '../bootstrap';
import { appStore } from '../store';
import { useAppSelector } from './useAppSelector';

export interface GoogleLinkApi {
	session: GoogleLinkPairingSession | null;
	expiresInSeconds: number | null;
	start: () => Promise<void>;
	copyCode: () => Promise<void>;
	copyUrl: () => Promise<void>;
	openUrl: () => void;
}

/**
 * End-to-end driver for the Google-link pairing flow. Subscribes to the
 * server-side pairing status, claims the session when it becomes
 * ready_to_switch, and cleans up after the switch. Emits toasts via the
 * `onToast` callback — caller decides how those are presented.
 */
export function useGoogleLinkFlow(onToast: (message: string) => void, nowMs: number): GoogleLinkApi {
	const session = useAppSelector((s) => s.googleLinkSession);
	const canonicalUid = useAppSelector((s) => s.canonicalUid);
	const evenUser = useAppSelector((s) => s.evenUser);

	const switchLockRef = useRef(false);
	const cleanupLockRef = useRef(false);
	const lastStatusKeyRef = useRef<string | null>(null);
	const lastErrorKeyRef = useRef<string | null>(null);
	const lastTerminalKeyRef = useRef<string | null>(null);

	const claimReady = useEffectEvent(
		async (s: GoogleLinkPairingSession, options: { showToast?: boolean } = {}) => {
			if (switchLockRef.current) return null;
			switchLockRef.current = true;
			try {
				const { targetUid, account, session: switched } = await claimReadyGooglePairing(s);
				appStore.setGoogleLinkSession(switched);
				appStore.setAccountInfo(account);
				if (options.showToast !== false) onToast('Google account linked');
				return { targetUid, account, session: switched };
			} catch (error) {
				console.error('[Smokeless] google link claim failed', error);
				if (isGoogleLinkNotFoundError(error)) {
					clearGooglePairingSession(s);
					appStore.setGoogleLinkSession(null);
					return null;
				}
				if (options.showToast !== false) {
					const claimState = await loadGoogleLinkClaimStateAsync(s.sessionId);
					onToast(claimState?.lastError || 'Could not finish Google linking');
				}
				return null;
			} finally {
				switchLockRef.current = false;
			}
		},
	);

	const cleanupSwitched = useEffectEvent(
		async (s: GoogleLinkPairingSession, options: { showToast?: boolean } = {}) => {
			if (cleanupLockRef.current) return null;
			if (!s.targetGoogleUid) return null;
			cleanupLockRef.current = true;
			try {
				const result = await completeGoogleLinkCleanup(s);
				clearGooglePairingSession(s);
				appStore.setGoogleLinkSession(null);
				if (options.showToast !== false) onToast('Google account linked');
				return result;
			} catch (error) {
				console.error('[Smokeless] google link cleanup failed', error);
				if (isGoogleLinkNotFoundError(error)) {
					appStore.setGoogleLinkSession(null);
					return null;
				}
				if (options.showToast !== false) onToast('Could not finish Google cleanup');
				return null;
			} finally {
				cleanupLockRef.current = false;
			}
		},
	);

	// Pairing status watcher — re-subscribes when sessionId changes.
	useEffect(() => {
		if (!session?.sessionId) return;
		const snapshotErrorKeyRef = { current: null as string | null };
		return watchGooglePairingStatus(
			session,
			(next) => {
				startTransition(() => {
					const current = appStore.getState().googleLinkSession;
					if (!isSameGoogleLinkSession(current, next)) {
						appStore.setGoogleLinkSession(next);
					}
				});
			},
			{
				viewerUid: canonicalUid,
				onError: (error) => {
					const code = error && typeof error === 'object' && 'code' in error ? String((error as { code?: unknown }).code ?? '') : '';
					// Debounce noise: only toast when the error kind changes.
					if (snapshotErrorKeyRef.current === code) return;
					snapshotErrorKeyRef.current = code;
					const message = error instanceof Error ? error.message : 'Google link status updates are temporarily unavailable.';
					onToast(`Link status: ${message}`);
				},
			},
		);
	}, [session?.sessionId, session?.sourceUid, canonicalUid, onToast]);

	// Status-transition driver — claims / cleans up on the appropriate phases.
	useEffect(() => {
		if (!session) {
			lastStatusKeyRef.current = null;
			lastErrorKeyRef.current = null;
			lastTerminalKeyRef.current = null;
			return;
		}

		const nextStatusKey = [
			session.sessionId,
			session.status,
			session.targetGoogleUid ?? '',
			session.errorCode ?? '',
			session.switchErrorAt ?? '',
		].join(':');
		const previousStatusKey = lastStatusKeyRef.current;
		lastStatusKeyRef.current = nextStatusKey;

		if (session.status === 'ready_to_switch') {
			void (async () => {
				const currentUid = await ensureFirebaseSession();
				if (currentUid !== session.sourceUid) return;
				if (session.errorCode) return;
				const transitionedIntoReady =
					previousStatusKey === null ||
					!previousStatusKey.startsWith(`${session.sessionId}:ready_to_switch:`);
				if (!transitionedIntoReady && !(await canRetryGoogleLinkClaim(session.sessionId))) return;
				const finalized = await claimReady(session, { showToast: false });
				if (!finalized) return;
				await rebootForUid();
			})();
		}

		if (session.status === 'switched') {
			void (async () => {
				const currentUid = await ensureFirebaseSession();
				if (currentUid !== session.targetGoogleUid) return;
				const cleaned = await cleanupSwitched(session, { showToast: false });
				if (!cleaned) return;
				await rebootForUid();
			})();
		}

		const nextErrorKey =
			session.errorCode || session.errorMessage
				? [
						session.sessionId,
						session.status,
						session.errorCode ?? '',
						session.switchErrorAt ?? '',
						session.errorMessage ?? '',
					].join(':')
				: null;
		if (nextErrorKey && nextErrorKey !== lastErrorKeyRef.current) {
			lastErrorKeyRef.current = nextErrorKey;
			if (session.status === 'failed' || session.errorCode === 'custom-token-mint-failed') {
				onToast(
					session.errorCode === 'custom-token-mint-failed'
						? 'Google account is ready, but Firebase custom token minting is blocked. Check Functions IAM.'
						: session.errorMessage || 'Google linking failed',
				);
			}
		}

		if (session.status === 'expired' || isTerminalGoogleLinkStatus(session.status)) {
			const terminalKey = `${session.sessionId}:${session.status}:${session.errorCode ?? ''}`;
			if (terminalKey !== lastTerminalKeyRef.current) {
				lastTerminalKeyRef.current = terminalKey;
				if (session.status === 'expired') onToast('Google link code expired');
			}
			clearGooglePairingSession(session);
		}
	}, [claimReady, cleanupSwitched, session, onToast]);

	const start = useEffectEvent(async () => {
		if (!evenUser) {
			onToast('Even user not yet available — try again in a moment.');
			return;
		}
		if (!canonicalUid) {
			onToast('Firebase account not yet ready — try again in a moment.');
			return;
		}
		appStore.setMutating(true);
		try {
			const next = await startGooglePairing(canonicalUid, evenUser.uid);
			appStore.setGoogleLinkSession(next);
			onToast('Google link code ready');
		} catch (error) {
			console.error('[Smokeless] google link session failed to start', error);
			const message = error instanceof Error ? error.message : 'Could not create Google link code.';
			onToast(message);
		} finally {
			appStore.setMutating(false);
		}
	});

	const copyCode = useEffectEvent(async () => {
		if (!session?.code || !navigator.clipboard?.writeText) return;
		await navigator.clipboard.writeText(session.code);
		onToast('Code copied');
	});

	const copyUrl = useEffectEvent(async () => {
		if (!session?.linkUrl || !navigator.clipboard?.writeText) return;
		await navigator.clipboard.writeText(session.linkUrl);
		onToast('Link copied');
	});

	const openUrl = useCallback(() => {
		if (!session?.linkUrl) return;
		window.open(session.linkUrl, '_blank', 'noopener,noreferrer');
	}, [session?.linkUrl]);

	const expiresInSeconds = session
		? Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - nowMs) / 1000))
		: null;

	return { session, expiresInSeconds, start, copyCode, copyUrl, openUrl };
}
