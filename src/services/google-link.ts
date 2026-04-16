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

function writeActiveGooglePairing(session: GoogleLinkPairingSession): void {
	void bridgeStorageSet(storageKey(session.sourceUid), JSON.stringify(session));
	if (session.targetGoogleUid) {
		void bridgeStorageSet(targetStorageKey(session.targetGoogleUid), JSON.stringify(session));
	}
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
	void bridgeStorageRemove(storageKey(sourceUid));
}

export function clearGooglePairingSession(session: GoogleLinkPairingSession | null): void {
	if (!session) return;
	clearActiveGooglePairing(session.sourceUid);
	if (session.targetGoogleUid) {
		void bridgeStorageRemove(targetStorageKey(session.targetGoogleUid));
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
	const direct = readStoredSession(await bridgeStorageGet(storageKey(sourceUid)));
	if (direct) return direct;
	return readStoredSession(await bridgeStorageGet(targetStorageKey(sourceUid)));
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
	value: Record<string, unknown>,
): GoogleLinkPairingSession {
	const next = normalizeSession(sourceUid, {
		sessionId: String(value.sessionId ?? current?.sessionId ?? ''),
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
	writeActiveGooglePairing(next);
	return next;
}

export async function refreshGooglePairingStatus(current: GoogleLinkPairingSession): Promise<GoogleLinkPairingSession | null> {
	const snapshot = await getDoc(doc(db, 'googleLinkSessions', current.sessionId));
	if (!snapshot.exists()) {
		clearGooglePairingSession(current);
		return null;
	}

	return mapSessionSnapshot(current.sourceUid, current, snapshot.data() as Record<string, unknown>);
}

export function watchGooglePairingStatus(
	current: GoogleLinkPairingSession,
	onValue: (session: GoogleLinkPairingSession | null) => void,
): () => void {
	return onSnapshot(
		doc(db, 'googleLinkSessions', current.sessionId),
		(snapshot) => {
			if (!snapshot.exists()) {
				clearActiveGooglePairing(current.sourceUid);
				onValue(null);
				return;
			}

			onValue(mapSessionSnapshot(current.sourceUid, current, snapshot.data() as Record<string, unknown>));
		},
		() => {
			onValue(current);
		},
	);
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
	const result = await callable({ sessionId: current.sessionId });
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
