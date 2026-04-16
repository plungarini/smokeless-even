import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import type { AuthAccountInfo, GoogleLinkPairingSession, GoogleLinkSessionStatus } from '../domain/types';
import { env } from '../config/env';
import { db, functions } from '../lib/firebase';
import { signInWithCanonicalCustomToken } from './auth';

const GOOGLE_LINK_STORAGE_PREFIX = 'smokeless:google-link:';

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

function storageKey(sourceUid: string): string {
	return `${GOOGLE_LINK_STORAGE_PREFIX}${sourceUid}`;
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
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(storageKey(session.sourceUid), JSON.stringify(session));
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
			errorCode: typeof parsed.errorCode === 'string' ? parsed.errorCode : undefined,
			errorMessage: typeof parsed.errorMessage === 'string' ? parsed.errorMessage : undefined,
		};
	} catch {
		return null;
	}
}

export function clearActiveGooglePairing(sourceUid: string): void {
	if (typeof window === 'undefined') return;
	window.localStorage.removeItem(storageKey(sourceUid));
}

export function clearGooglePairingSession(session: GoogleLinkPairingSession | null): void {
	if (!session) return;
	clearActiveGooglePairing(session.sourceUid);
}

export function loadActiveGooglePairing(sourceUid: string): GoogleLinkPairingSession | null {
	if (typeof window === 'undefined') return null;

	const direct = readStoredSession(window.localStorage.getItem(storageKey(sourceUid)));
	if (direct) return direct;

	for (let index = 0; index < window.localStorage.length; index += 1) {
		const key = window.localStorage.key(index);
		if (!key || !key.startsWith(GOOGLE_LINK_STORAGE_PREFIX)) continue;
		const session = readStoredSession(window.localStorage.getItem(key));
		if (!session) continue;
		if (session.sourceUid === sourceUid || session.targetGoogleUid === sourceUid) {
			return session;
		}
	}

	return null;
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
		errorCode: typeof value.errorCode === 'string' ? value.errorCode : current?.errorCode,
		errorMessage: typeof value.errorMessage === 'string' ? value.errorMessage : current?.errorMessage,
	});
	writeActiveGooglePairing(next);
	return next;
}

export async function refreshGooglePairingStatus(current: GoogleLinkPairingSession): Promise<GoogleLinkPairingSession | null> {
	const snapshot = await getDoc(doc(db, 'googleLinkSessions', current.sessionId));
	if (!snapshot.exists()) {
		clearActiveGooglePairing(current.sourceUid);
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
	const result = await callable({ sessionId: current.sessionId });
	const account = await signInWithCanonicalCustomToken(result.data.customToken);
	const session = normalizeSession(current.sourceUid, {
		status: result.data.status,
		sessionId: current.sessionId,
		code: current.code,
		linkUrl: current.linkUrl,
		expiresAt: current.expiresAt,
		targetGoogleUid: result.data.targetUid,
		targetGoogleEmail: result.data.account.googleEmail || current.targetGoogleEmail,
		targetGoogleDisplayName: result.data.account.googleDisplayName || current.targetGoogleDisplayName,
		errorCode: current.errorCode,
		errorMessage: current.errorMessage,
	});
	writeActiveGooglePairing(session);
	return {
		targetUid: result.data.targetUid,
		account,
		session,
	};
}

export async function completeGoogleLinkCleanup(
	current: GoogleLinkPairingSession,
): Promise<{ targetUid: string; account: AuthAccountInfo }> {
	const callable = httpsCallable<{ sessionId: string }, CompleteGoogleLinkCleanupResponse>(functions, 'completeGoogleLinkCleanup');
	const result = await callable({ sessionId: current.sessionId });
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
