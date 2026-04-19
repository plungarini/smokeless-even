import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import type { AuthAccountInfo, GoogleLinkPairingSession, GoogleLinkSessionStatus } from '../domain/types';
import { env } from '../config/env';
import { db, functions } from '../lib/firebase';
import { bridgeStorageGet, bridgeStorageRemove, bridgeStorageSet } from './bridge-storage';
import { signInWithCanonicalCustomToken } from './auth';

const GOOGLE_LINK_STORAGE_PREFIX = 'smokeless:google-link:';
const GOOGLE_LINK_CLAIM_STORAGE_PREFIX = 'smokeless:google-link-claim:';
const CLAIM_RETRY_INTERVAL_MS = 15_000;

interface CreateGoogleLinkSessionResponse {
	sessionId: string;
	code: string;
	expiresAt: string;
	linkUrl: string;
}

interface ResolveGoogleLinkCodeResponse {
	sessionId: string;
	expiresAt: string;
}

interface CompleteGoogleLinkSessionResponse {
	status: GoogleLinkSessionStatus;
	targetGoogleEmail?: string;
	targetGoogleDisplayName?: string;
}

interface PrepareGoogleLinkMigrationResponse {
	status: GoogleLinkSessionStatus;
	targetUid: string;
	targetGoogleEmail?: string;
	targetGoogleDisplayName?: string;
}

interface ClaimGoogleLinkSessionResponse {
	status: GoogleLinkSessionStatus;
	customToken: string;
	targetUid: string;
	account: AuthAccountInfo;
}

interface CompleteGoogleLinkCleanupResponse {
	status: GoogleLinkSessionStatus;
	targetUid: string;
	account: AuthAccountInfo;
}

interface GoogleLinkClaimState {
	lastAttemptAt: number;
	lastError?: string;
}

const persistedGoogleLinkSessionCache = new Map<string, string>();

function storageKey(sourceUid: string): string {
	return `${GOOGLE_LINK_STORAGE_PREFIX}${sourceUid}`;
}

function targetStorageKey(targetUid: string): string {
	return `${GOOGLE_LINK_STORAGE_PREFIX}target:${targetUid}`;
}

function claimStorageKey(sessionId: string): string {
	return `${GOOGLE_LINK_CLAIM_STORAGE_PREFIX}${sessionId}`;
}

function toIsoString(value: unknown): string {
	if (!value) return new Date().toISOString();
	if (typeof value === 'string') return value;
	if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
		return (value as { toDate: () => Date }).toDate().toISOString();
	}
	if (value instanceof Date) return value.toISOString();
	return new Date(String(value)).toISOString();
}

function normalizeSession(
	sourceUid: string,
	session: Omit<GoogleLinkPairingSession, 'sourceUid'>,
): GoogleLinkPairingSession {
	return {
		sourceUid,
		...session,
	};
}

function getSessionPersistenceSnapshot(session: GoogleLinkPairingSession): string {
	return JSON.stringify({
		sessionId: session.sessionId,
		sourceUid: session.sourceUid,
		code: session.code,
		linkUrl: session.linkUrl,
		expiresAt: session.expiresAt,
		status: session.status,
		targetGoogleUid: session.targetGoogleUid ?? null,
		targetGoogleEmail: session.targetGoogleEmail ?? null,
		targetGoogleDisplayName: session.targetGoogleDisplayName ?? null,
		switchErrorAt: session.switchErrorAt ?? null,
		errorCode: session.errorCode ?? null,
		errorMessage: session.errorMessage ?? null,
	});
}

export function isSameGoogleLinkSession(
	left: GoogleLinkPairingSession | null,
	right: GoogleLinkPairingSession | null,
): boolean {
	if (left === right) return true;
	if (!left || !right) return false;
	return getSessionPersistenceSnapshot(left) === getSessionPersistenceSnapshot(right);
}

function getPersistedKeys(session: GoogleLinkPairingSession): string[] {
	return session.targetGoogleUid
		? [storageKey(session.sourceUid), targetStorageKey(session.targetGoogleUid)]
		: [storageKey(session.sourceUid)];
}

function writeBridgeStorageIfChanged(key: string, serialized: string): void {
	if (persistedGoogleLinkSessionCache.get(key) === serialized) {
		return;
	}
	persistedGoogleLinkSessionCache.set(key, serialized);
	void bridgeStorageSet(key, serialized);
}

function writeActiveGooglePairing(session: GoogleLinkPairingSession): void {
	const serialized = getSessionPersistenceSnapshot(session);
	for (const key of getPersistedKeys(session)) {
		writeBridgeStorageIfChanged(key, serialized);
	}
}

function didSessionMateriallyChange(
	current: GoogleLinkPairingSession | null,
	next: GoogleLinkPairingSession,
): boolean {
	if (!current) return true;
	return getSessionPersistenceSnapshot(current) !== getSessionPersistenceSnapshot(next);
}

function readStoredSession(raw: string | null): GoogleLinkPairingSession | null {
	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw) as Partial<GoogleLinkPairingSession>;
		if (
			typeof parsed.sessionId !== 'string' ||
			typeof parsed.sourceUid !== 'string' ||
			typeof parsed.code !== 'string' ||
			typeof parsed.expiresAt !== 'string' ||
			typeof parsed.linkUrl !== 'string' ||
			typeof parsed.status !== 'string'
		) {
			return null;
		}
		return {
			sessionId: parsed.sessionId,
			sourceUid: parsed.sourceUid,
			code: parsed.code,
			linkUrl: parsed.linkUrl,
			expiresAt: parsed.expiresAt,
			status: parsed.status as GoogleLinkSessionStatus,
			targetGoogleUid: typeof parsed.targetGoogleUid === 'string' ? parsed.targetGoogleUid : undefined,
			targetGoogleEmail: typeof parsed.targetGoogleEmail === 'string' ? parsed.targetGoogleEmail : undefined,
			targetGoogleDisplayName: typeof parsed.targetGoogleDisplayName === 'string' ? parsed.targetGoogleDisplayName : undefined,
			switchErrorAt: typeof parsed.switchErrorAt === 'string' ? parsed.switchErrorAt : undefined,
			errorCode: typeof parsed.errorCode === 'string' ? parsed.errorCode : undefined,
			errorMessage: typeof parsed.errorMessage === 'string' ? parsed.errorMessage : undefined,
		};
	} catch {
		return null;
	}
}

export function clearActiveGooglePairing(sourceUid: string): void {
	const key = storageKey(sourceUid);
	persistedGoogleLinkSessionCache.delete(key);
	void bridgeStorageRemove(key);
}

export function clearGooglePairingSession(session: GoogleLinkPairingSession | null): void {
	if (!session) return;
	clearActiveGooglePairing(session.sourceUid);
	if (session.targetGoogleUid) {
		const key = targetStorageKey(session.targetGoogleUid);
		persistedGoogleLinkSessionCache.delete(key);
		void bridgeStorageRemove(key);
	}
	clearGoogleLinkClaimAttempt(session.sessionId);
}

export async function loadGoogleLinkClaimStateAsync(sessionId: string): Promise<GoogleLinkClaimState | null> {
	try {
		const raw = await bridgeStorageGet(claimStorageKey(sessionId));
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<GoogleLinkClaimState>;
		if (typeof parsed.lastAttemptAt !== 'number') return null;
		return {
			lastAttemptAt: parsed.lastAttemptAt,
			lastError: typeof parsed.lastError === 'string' ? parsed.lastError : undefined,
		};
	} catch {
		return null;
	}
}

export function recordGoogleLinkClaimAttempt(sessionId: string, error?: string): void {
	void bridgeStorageSet(
		claimStorageKey(sessionId),
		JSON.stringify({
			lastAttemptAt: Date.now(),
			lastError: error,
		}),
	);
}

export function clearGoogleLinkClaimAttempt(sessionId: string): void {
	void bridgeStorageRemove(claimStorageKey(sessionId));
}

export async function canRetryGoogleLinkClaim(sessionId: string, now = Date.now()): Promise<boolean> {
	const state = await loadGoogleLinkClaimStateAsync(sessionId);
	if (!state) return true;
	return now - state.lastAttemptAt >= CLAIM_RETRY_INTERVAL_MS;
}

export async function loadActiveGooglePairingAsync(sourceUid: string): Promise<GoogleLinkPairingSession | null> {
	const directKey = storageKey(sourceUid);
	const direct = readStoredSession(await bridgeStorageGet(directKey));
	if (direct) {
		persistedGoogleLinkSessionCache.set(directKey, getSessionPersistenceSnapshot(direct));
		if (direct.targetGoogleUid) {
			persistedGoogleLinkSessionCache.set(targetStorageKey(direct.targetGoogleUid), getSessionPersistenceSnapshot(direct));
		}
		return direct;
	}
	const targetKey = targetStorageKey(sourceUid);
	const target = readStoredSession(await bridgeStorageGet(targetKey));
	if (target) {
		persistedGoogleLinkSessionCache.set(targetKey, getSessionPersistenceSnapshot(target));
		persistedGoogleLinkSessionCache.set(storageKey(target.sourceUid), getSessionPersistenceSnapshot(target));
	}
	return target;
}

export async function startGooglePairing(sourceUid: string, sourceEvenUid: string): Promise<GoogleLinkPairingSession> {
	const createGoogleLinkSession = httpsCallable<{ sourceEvenUid: string }, CreateGoogleLinkSessionResponse>(
		functions,
		'createGoogleLinkSession',
	);
	const result = await createGoogleLinkSession({ sourceEvenUid });
	const session = normalizeSession(sourceUid, {
		sessionId: result.data.sessionId,
		code: result.data.code,
		linkUrl: result.data.linkUrl || env.googleLinkUrl,
		expiresAt: result.data.expiresAt,
		status: 'pending',
	});
	writeActiveGooglePairing(session);
	return session;
}

function mapSessionSnapshot(
	sourceUid: string,
	current: GoogleLinkPairingSession | null,
	value: Record<string, unknown> | undefined,
): GoogleLinkPairingSession | null {
	if (!value) {
		return current;
	}

	const sessionId = typeof value.sessionId === 'string' ? value.sessionId : current?.sessionId;
	if (!sessionId) {
		return current;
	}

	const next = normalizeSession(sourceUid, {
		sessionId,
		code: current?.code ?? '',
		linkUrl: current?.linkUrl ?? '',
		expiresAt: toIsoString(value.expiresAt ?? current?.expiresAt ?? new Date()),
		status: String(value.status ?? current?.status ?? 'pending') as GoogleLinkSessionStatus,
		targetGoogleUid: typeof value.targetGoogleUid === 'string' ? value.targetGoogleUid : current?.targetGoogleUid,
		targetGoogleEmail: typeof value.targetGoogleEmail === 'string' ? value.targetGoogleEmail : current?.targetGoogleEmail,
		targetGoogleDisplayName:
			typeof value.targetGoogleDisplayName === 'string' ? value.targetGoogleDisplayName : current?.targetGoogleDisplayName,
		switchErrorAt:
			value.switchErrorAt !== undefined ? toIsoString(value.switchErrorAt) : current?.switchErrorAt,
		errorCode: typeof value.errorCode === 'string' ? value.errorCode : current?.errorCode,
		errorMessage: typeof value.errorMessage === 'string' ? value.errorMessage : current?.errorMessage,
	});
	if (didSessionMateriallyChange(current, next)) {
		writeActiveGooglePairing(next);
	}
	return next;
}

export async function refreshGooglePairingStatus(
	current: GoogleLinkPairingSession,
	viewerUid?: string | null,
): Promise<GoogleLinkPairingSession | null> {
	let snapshot;
	try {
		snapshot = await getDoc(doc(db, 'googleLinkSessions', current.sessionId));
	} catch (error) {
		if (isGoogleLinkPermissionDeniedError(error)) {
			if (viewerUid && viewerUid === current.targetGoogleUid && viewerUid !== current.sourceUid) {
				return current;
			}
			clearGooglePairingSession(current);
			return null;
		}
		throw error;
	}
	if (!snapshot.exists()) {
		clearGooglePairingSession(current);
		return null;
	}

	return mapSessionSnapshot(current.sourceUid, current, snapshot.data() as Record<string, unknown> | undefined);
}

const POLLING_INTERVAL_MS = 3_000;
const POLLING_MAX_DURATION_MS = 5 * 60_000;

export interface WatchGooglePairingStatusOptions {
	onError?: (error: unknown) => void;
	viewerUid?: string | null;
}

export function watchGooglePairingStatus(
	current: GoogleLinkPairingSession,
	onValue: (session: GoogleLinkPairingSession | null) => void,
	options: WatchGooglePairingStatusOptions = {},
): () => void {
	let cancelled = false;
	let pollingTimer: ReturnType<typeof setInterval> | null = null;
	let pollingStartedAt = 0;

	const stopPolling = () => {
		if (pollingTimer) {
			clearInterval(pollingTimer);
			pollingTimer = null;
		}
	};

	const startPolling = () => {
		if (pollingTimer || cancelled) return;
		pollingStartedAt = Date.now();
		pollingTimer = setInterval(() => {
			if (cancelled) {
				stopPolling();
				return;
			}
			if (Date.now() - pollingStartedAt > POLLING_MAX_DURATION_MS) {
				stopPolling();
				return;
			}
			void refreshGooglePairingStatus(current, options.viewerUid ?? null)
				.then((next) => {
					if (!cancelled) onValue(next);
				})
				.catch((error) => {
					console.error('[Smokeless] google link polling failed', error);
					options.onError?.(error);
				});
		}, POLLING_INTERVAL_MS);
	};

	const unsubscribe = onSnapshot(
		doc(db, 'googleLinkSessions', current.sessionId),
		(snapshot) => {
			stopPolling();
			if (!snapshot.exists()) {
				clearGooglePairingSession(current);
				onValue(null);
				return;
			}
			onValue(mapSessionSnapshot(current.sourceUid, current, snapshot.data() as Record<string, unknown> | undefined));
		},
		(error) => {
			console.error('[Smokeless] google link snapshot failed', error);
			options.onError?.(error);
			// Fall back to polling so we still observe the linker's progress.
			startPolling();
		},
	);

	return () => {
		cancelled = true;
		stopPolling();
		unsubscribe();
	};
}

function getFirebaseErrorCode(error: unknown): string | null {
	if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
		return error.code;
	}
	return null;
}

export function isGoogleLinkNotFoundError(error: unknown): boolean {
	const code = getFirebaseErrorCode(error);
	return code === 'functions/not-found' || code === 'not-found';
}

export function isGoogleLinkPermissionDeniedError(error: unknown): boolean {
	const code = getFirebaseErrorCode(error);
	return code === 'functions/permission-denied' || code === 'permission-denied';
}

export async function resolveGoogleLinkCode(code: string): Promise<ResolveGoogleLinkCodeResponse> {
	const callable = httpsCallable<{ code: string }, ResolveGoogleLinkCodeResponse>(functions, 'resolveGoogleLinkCode');
	const result = await callable({ code });
	return result.data;
}

export async function completeGoogleLinkSession(sessionId: string): Promise<CompleteGoogleLinkSessionResponse> {
	const callable = httpsCallable<{ sessionId: string }, CompleteGoogleLinkSessionResponse>(functions, 'completeGoogleLinkSession');
	const result = await callable({ sessionId });
	return result.data;
}

export async function prepareGoogleLinkMigration(sessionId: string): Promise<PrepareGoogleLinkMigrationResponse> {
	const callable = httpsCallable<{ sessionId: string }, PrepareGoogleLinkMigrationResponse>(functions, 'prepareGoogleLinkMigration');
	const result = await callable({ sessionId });
	return result.data;
}

export async function claimReadyGooglePairing(
	current: GoogleLinkPairingSession,
): Promise<{ targetUid: string; account: AuthAccountInfo; session: GoogleLinkPairingSession }> {
	const callable = httpsCallable<{ sessionId: string }, ClaimGoogleLinkSessionResponse>(functions, 'claimGoogleLinkSession');
	recordGoogleLinkClaimAttempt(current.sessionId);
	try {
		const result = await callable({ sessionId: current.sessionId });
		const account = await signInWithCanonicalCustomToken(result.data.customToken);
		clearGoogleLinkClaimAttempt(current.sessionId);
		const session = normalizeSession(current.sourceUid, {
			status: result.data.status,
			sessionId: current.sessionId,
			code: current.code,
			linkUrl: current.linkUrl,
			expiresAt: current.expiresAt,
			targetGoogleUid: result.data.targetUid,
			targetGoogleEmail: result.data.account.googleEmail || current.targetGoogleEmail,
			targetGoogleDisplayName: result.data.account.googleDisplayName || current.targetGoogleDisplayName,
			switchErrorAt: undefined,
			errorCode: undefined,
			errorMessage: undefined,
		});
		writeActiveGooglePairing(session);
		return {
			targetUid: result.data.targetUid,
			account,
			session,
		};
	} catch (error) {
		if (isGoogleLinkNotFoundError(error)) {
			clearGooglePairingSession(current);
			throw error;
		}
		recordGoogleLinkClaimAttempt(
			current.sessionId,
			error instanceof Error ? error.message : 'Could not claim the Google link session.',
		);
		throw error;
	}
}

export async function completeGoogleLinkCleanup(
	current: GoogleLinkPairingSession,
): Promise<{ targetUid: string; account: AuthAccountInfo }> {
	const callable = httpsCallable<{ sessionId: string }, CompleteGoogleLinkCleanupResponse>(functions, 'completeGoogleLinkCleanup');
	let result: Awaited<ReturnType<typeof callable>>;
	try {
		result = await callable({ sessionId: current.sessionId });
	} catch (error) {
		if (isGoogleLinkNotFoundError(error)) {
			clearGooglePairingSession(current);
		}
		throw error;
	}
	clearGoogleLinkClaimAttempt(current.sessionId);
	clearGooglePairingSession(current);
	return {
		targetUid: result.data.targetUid,
		account: result.data.account,
	};
}

export async function finalizeGoogleLinkSession(sessionId: string): Promise<PrepareGoogleLinkMigrationResponse> {
	const callable = httpsCallable<{ sessionId: string }, PrepareGoogleLinkMigrationResponse>(functions, 'prepareGoogleLinkMigration');
	const result = await callable({ sessionId });
	return result.data;
}
