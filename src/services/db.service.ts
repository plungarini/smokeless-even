/**
 * Unified storage/db service.
 *
 * Every consumer (store, bootstrap, hooks) calls THIS module — never
 * `firestore.ts` or `local-repo.ts` directly. The router reads the active
 * auth mode from `appStore` and dispatches to the correct backend.
 *
 * Local mode  → Bridge Local Storage (services/local-repo.ts)
 * Google mode → Firestore              (services/firestore.ts)
 *
 * Keeping the dispatch in one place means components/hooks stay agnostic
 * of persistence and both backends expose exactly the same call signatures.
 */

import type {
	AuthAccountInfo,
	EvenUserInfo,
	HistoryDayGroup,
	SmokeLogEntry,
	UserDocument,
} from '../domain/types';
import { appStore } from '../app/store';
import type { AuthMode } from './auth-mode';
import * as firestoreRepo from './firestore';
import * as localRepo from './local-repo';

function mode(): AuthMode {
	const stored = appStore.getState().authMode;
	// Default to 'local' for pure-read paths that run before onboarding
	// finishes — they'll return empty data in Local mode, which is correct.
	return stored ?? 'local';
}

export {
	deriveStatsFromLogs,
	deriveHistoryGroupsFromLogs,
	getHistoryEntriesForMonth,
} from './firestore';

export type HistoryCursor = unknown;

export async function fetchUserDocument(uid: string): Promise<UserDocument | null> {
	return mode() === 'local' ? localRepo.fetchUserDocument(uid) : firestoreRepo.fetchUserDocument(uid);
}

export function subscribeToUserDocument(
	uid: string,
	onValue: (document: UserDocument | null) => void,
): () => void {
	return mode() === 'local'
		? localRepo.subscribeToUserDocument(uid, onValue)
		: firestoreRepo.subscribeToUserDocument(uid, onValue);
}

export function subscribeToTodayCount(uid: string, onValue: (count: number) => void): () => void {
	return mode() === 'local'
		? localRepo.subscribeToTodayCount(uid, onValue)
		: firestoreRepo.subscribeToTodayCount(uid, onValue);
}

export async function fetchAllLogEntries(uid: string): Promise<SmokeLogEntry[]> {
	return mode() === 'local' ? localRepo.fetchAllLogEntries(uid) : firestoreRepo.fetchAllLogEntries(uid);
}

export async function fetchLastLogEntry(uid: string): Promise<SmokeLogEntry | null> {
	return mode() === 'local' ? localRepo.fetchLastLogEntry(uid) : firestoreRepo.fetchLastLogEntry(uid);
}

export async function ensureCanonicalUserData(uid: string, evenUser: EvenUserInfo): Promise<void> {
	return mode() === 'local'
		? localRepo.ensureCanonicalUserData(uid, evenUser)
		: firestoreRepo.ensureCanonicalUserData(uid, evenUser);
}

export async function upsertAuthProviderFields(uid: string, account: AuthAccountInfo): Promise<void> {
	return mode() === 'local'
		? localRepo.upsertAuthProviderFields(uid, account)
		: firestoreRepo.upsertAuthProviderFields(uid, account);
}

export async function addSmokeEntry(uid: string, timestamp?: Date): Promise<string> {
	return mode() === 'local'
		? localRepo.addSmokeEntry(uid, timestamp)
		: firestoreRepo.addSmokeEntry(uid, timestamp);
}

export async function deleteLogEntry(uid: string, logId: string): Promise<void> {
	return mode() === 'local' ? localRepo.deleteLogEntry(uid, logId) : firestoreRepo.deleteLogEntry(uid, logId);
}

export async function deleteAllUserData(uid: string): Promise<void> {
	return mode() === 'local' ? localRepo.deleteAllUserData(uid) : firestoreRepo.deleteAllUserData(uid);
}

export async function exportLogs(uid: string) {
	return mode() === 'local' ? localRepo.exportLogs(uid) : firestoreRepo.exportLogs(uid);
}

export async function fetchHistoryPage(
	uid: string,
	cursor: HistoryCursor,
): Promise<{ groups: HistoryDayGroup[]; cursor: HistoryCursor; hasMore: boolean }> {
	return mode() === 'local'
		? localRepo.fetchHistoryPage(uid, null)
		: firestoreRepo.fetchHistoryPage(uid, cursor as firestoreRepo.HistoryCursor);
}

export async function fetchDailyStats(uid: string, days?: number): Promise<Record<string, number>> {
	return mode() === 'local' ? localRepo.fetchDailyStats(uid, days) : firestoreRepo.fetchDailyStats(uid, days);
}

export async function fetchMonthlyStats(uid: string, months?: number): Promise<Record<string, number>> {
	return mode() === 'local'
		? localRepo.fetchMonthlyStats(uid, months)
		: firestoreRepo.fetchMonthlyStats(uid, months);
}
