import {
	type DocumentSnapshot,
	type QueryDocumentSnapshot,
	type Timestamp,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	startAfter,
	updateDoc,
	where,
	writeBatch,
} from 'firebase/firestore';
import { computeLongestCessation } from '../domain/calculations';
import type {
	AuthAccountInfo,
	EvenUserInfo,
	HistoryDayGroup,
	SmokeLogEntry,
	UserDocument,
	UserEvenProvider,
	UserGoogleProvider,
	UserPreferences,
} from '../domain/types';
import { db } from '../lib/firebase';
import { addDays, diffCalendarDays, parseDayKey, startOfDay, toDayKey, toMonthKey } from '../lib/time';

export type HistoryCursor = QueryDocumentSnapshot | null;

const DEFAULT_PREFERENCES: UserPreferences = {
	locale: 'en',
	themeMode: 'dark',
	weekStart: 'Monday',
};

function userRef(uid: string) {
	return doc(db, 'users', uid);
}

function logsRef(uid: string) {
	return collection(db, 'users', uid, 'logs');
}

function toDate(value: unknown): Date | null {
	if (!value) return null;
	if (
		typeof value === 'object' &&
		value !== null &&
		'toDate' in value &&
		typeof (value as Timestamp).toDate === 'function'
	) {
		return (value as Timestamp).toDate();
	}
	return null;
}

function mapEvenProvider(value: unknown): UserEvenProvider | null {
	if (!value || typeof value !== 'object') return null;
	const provider = value as Record<string, unknown>;
	const uid = String(provider.uid ?? '');
	if (!uid) return null;
	return {
		uid,
		name: String(provider.name ?? ''),
		avatar: String(provider.avatar ?? ''),
		country: String(provider.country ?? 'US'),
		linkedAt: toDate(provider.linkedAt),
	};
}

function mapGoogleProvider(value: unknown): UserGoogleProvider | null {
	if (!value || typeof value !== 'object') return null;
	const provider = value as Record<string, unknown>;
	const uid = String(provider.uid ?? '');
	if (!uid) return null;
	return {
		uid,
		email: String(provider.email ?? ''),
		displayName: String(provider.displayName ?? ''),
		linkedAt: toDate(provider.linkedAt),
	};
}

function mapUserDocument(snapshot: DocumentSnapshot): UserDocument | null {
	if (!snapshot.exists()) return null;

	const data = snapshot.data({ serverTimestamps: 'estimate' }) ?? {};
	const preferences = (data.preferences as Record<string, unknown> | undefined) ?? {};
	const providers = (data.providers as Record<string, unknown> | undefined) ?? {};

	return {
		createdAt: toDate(data.createdAt),
		updatedAt: toDate(data.updatedAt),
		longestEverCessation: Number(data.longestEverCessation ?? 0),
		todayMaxCessation:
			data.todayMaxCessation && typeof data.todayMaxCessation === 'object'
				? {
						value: Number((data.todayMaxCessation as Record<string, unknown>).value ?? 0),
						lastUpdated: toDate((data.todayMaxCessation as Record<string, unknown>).lastUpdated),
					}
				: null,
		preferences: {
			locale: String(preferences.locale ?? DEFAULT_PREFERENCES.locale),
			themeMode: String(preferences.themeMode ?? DEFAULT_PREFERENCES.themeMode),
			weekStart: String(preferences.weekStart ?? DEFAULT_PREFERENCES.weekStart),
		},
		providers: {
			google: mapGoogleProvider(providers.google),
			even: mapEvenProvider(providers.even),
		},
	};
}

function mapLogSnapshot(snapshot: DocumentSnapshot | QueryDocumentSnapshot): SmokeLogEntry {
	const data = snapshot.data() ?? {};
	return {
		id: snapshot.id,
		timestamp: toDate(data.timestamp) ?? new Date(),
		intervalSincePrevious:
			typeof data.intervalSincePrevious === 'number'
				? data.intervalSincePrevious
				: Number(data.intervalSincePrevious ?? null),
	};
}

function buildDefaultUserDocument(evenUser: EvenUserInfo): Omit<UserDocument, 'createdAt' | 'updatedAt'> {
	return {
		longestEverCessation: 0,
		todayMaxCessation: null,
		preferences: DEFAULT_PREFERENCES,
		providers: {
			google: null,
			even: {
				uid: evenUser.uid,
				name: evenUser.name,
				avatar: evenUser.avatar,
				country: evenUser.country,
				linkedAt: null,
			},
		},
	};
}

function buildEvenProvider(evenUser: EvenUserInfo): UserEvenProvider {
	return {
		uid: evenUser.uid,
		name: evenUser.name,
		avatar: evenUser.avatar,
		country: evenUser.country,
		linkedAt: new Date(),
	};
}

function buildGoogleProvider(account: AuthAccountInfo): UserGoogleProvider | null {
	if (account.authProvider !== 'google') return null;
	return {
		uid: account.uid,
		email: account.googleEmail,
		displayName: account.googleDisplayName,
		linkedAt: new Date(),
	};
}

function mergeProviders(
	target: UserDocument['providers'],
	source: UserDocument['providers'],
	evenUser: EvenUserInfo,
	account: AuthAccountInfo | null,
): UserDocument['providers'] {
	return {
		google:
			buildGoogleProvider(
				account ?? { uid: '', authProvider: 'anonymous', googleEmail: '', googleDisplayName: '', isAnonymous: true },
			) ??
			target.google ??
			source.google,
		even: buildEvenProvider(evenUser) ?? target.even ?? source.even,
	};
}

function mergeUserDocuments(
	target: UserDocument | null,
	source: UserDocument | null,
	evenUser: EvenUserInfo,
	account: AuthAccountInfo | null,
): Omit<UserDocument, 'createdAt' | 'updatedAt'> {
	const fallback = buildDefaultUserDocument(evenUser);
	return {
		longestEverCessation: target?.longestEverCessation ?? source?.longestEverCessation ?? fallback.longestEverCessation,
		todayMaxCessation: target?.todayMaxCessation ?? source?.todayMaxCessation ?? fallback.todayMaxCessation,
		preferences: target?.preferences ?? source?.preferences ?? fallback.preferences,
		providers: mergeProviders(
			target?.providers ?? fallback.providers,
			source?.providers ?? fallback.providers,
			evenUser,
			account,
		),
	};
}

function dedupeLogs(entries: SmokeLogEntry[]): SmokeLogEntry[] {
	const byTimestamp = new Map<string, SmokeLogEntry>();

	for (const entry of entries) {
		const key = entry.timestamp.toISOString();
		if (!byTimestamp.has(key)) {
			byTimestamp.set(key, entry);
		}
	}

	return [...byTimestamp.values()].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
}

function rebuildIntervals(entries: SmokeLogEntry[]): SmokeLogEntry[] {
	const sorted = [...entries].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
	return sorted.map((entry, index) => {
		const previous = sorted[index - 1];
		return {
			id: entry.id,
			timestamp: entry.timestamp,
			intervalSincePrevious: previous
				? Math.max(0, Math.round((entry.timestamp.getTime() - previous.timestamp.getTime()) / 1000))
				: null,
		};
	});
}

function buildTodayMaxCessation(
	entries: SmokeLogEntry[],
	now = new Date(),
): { value: number; lastUpdated: Date } | null {
	const dayStart = startOfDay(now);
	const sorted = [...entries].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
	let maxSeconds = 0;
	let hasSmokesToday = false;
	let previousTimestamp: Date | null = null;

	for (const entry of sorted) {
		if (entry.timestamp < dayStart) {
			previousTimestamp = entry.timestamp;
			continue;
		}
		hasSmokesToday = true;
		// Use the actual gap between consecutive smokes (matching Flutter's intervalSincePrevious logic).
		// No tail included — the live running time is added in the display layer only.
		if (previousTimestamp !== null) {
			const gapSeconds = Math.max(0, Math.round((entry.timestamp.getTime() - previousTimestamp.getTime()) / 1000));
			maxSeconds = Math.max(maxSeconds, gapSeconds);
		}
		previousTimestamp = entry.timestamp;
	}

	// Only persist if there was at least one smoke today (produces a closed gap to store).
	if (!hasSmokesToday) return null;

	return {
		value: maxSeconds,
		lastUpdated: now,
	};
}

function buildDailyCounts(entries: SmokeLogEntry[]): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const entry of entries) {
		const dayKey = toDayKey(entry.timestamp);
		counts[dayKey] = (counts[dayKey] ?? 0) + 1;
	}
	return counts;
}

function buildMonthlyCounts(entries: SmokeLogEntry[]): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const entry of entries) {
		const monthKey = toMonthKey(entry.timestamp);
		counts[monthKey] = (counts[monthKey] ?? 0) + 1;
	}
	return counts;
}

export function deriveStatsFromLogs(entries: SmokeLogEntry[]): {
	daily: Record<string, number>;
	monthly: Record<string, number>;
	lastSmokeAt: Date | null;
} {
	const sorted = [...entries].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
	return {
		daily: buildDailyCounts(sorted),
		monthly: buildMonthlyCounts(sorted),
		lastSmokeAt: sorted[sorted.length - 1]?.timestamp ?? null,
	};
}

function buildHistoryGroups(entries: SmokeLogEntry[]): HistoryDayGroup[] {
	const groups: HistoryDayGroup[] = [];
	const descending = [...entries].sort((left, right) => right.timestamp.getTime() - left.timestamp.getTime());

	for (const entry of descending) {
		const dayKey = toDayKey(entry.timestamp);
		const existing = groups[groups.length - 1];
		if (!existing || existing.dayKey !== dayKey) {
			groups.push({
				dayKey,
				date: parseDayKey(dayKey),
				count: 0,
				entries: [],
			});
		}
		const group = groups[groups.length - 1]!;
		group.entries.push(entry);
		group.count += 1;
	}

	return groups;
}

async function getLogPage(uid: string, pageSize: number, cursor: QueryDocumentSnapshot | null) {
	return cursor
		? getDocs(query(logsRef(uid), orderBy('timestamp', 'desc'), startAfter(cursor), limit(pageSize)))
		: getDocs(query(logsRef(uid), orderBy('timestamp', 'desc'), limit(pageSize)));
}

async function clearLogs(uid: string): Promise<void> {
	while (true) {
		const snapshot = await getDocs(query(logsRef(uid), orderBy('timestamp'), limit(200)));
		if (snapshot.empty) break;

		const batch = writeBatch(db);
		snapshot.forEach((docSnapshot) => batch.delete(docSnapshot.ref));
		await batch.commit();

		if (snapshot.size < 200) break;
	}
}

async function rewriteLogs(uid: string, entries: SmokeLogEntry[]): Promise<void> {
	await clearLogs(uid);
	const rebuilt = rebuildIntervals(entries);
	for (let index = 0; index < rebuilt.length; index += 200) {
		const batch = writeBatch(db);
		for (const entry of rebuilt.slice(index, index + 200)) {
			const ref = entry.id ? doc(db, 'users', uid, 'logs', entry.id) : doc(logsRef(uid));
			batch.set(ref, {
				timestamp: entry.timestamp,
				intervalSincePrevious: entry.intervalSincePrevious,
			});
		}
		await batch.commit();
	}
}

async function updateUserMetrics(uid: string, entries: SmokeLogEntry[]): Promise<void> {
	const now = new Date();
	await setDoc(
		userRef(uid),
		{
			longestEverCessation: Math.round((computeLongestCessation(entries, now) ?? 0) / 1000),
			todayMaxCessation: buildTodayMaxCessation(entries, now)
				? {
						value: buildTodayMaxCessation(entries, now)!.value,
						lastUpdated: buildTodayMaxCessation(entries, now)!.lastUpdated,
					}
				: null,
			updatedAt: serverTimestamp(),
		},
		{ merge: true },
	);
}

export async function fetchUserDocument(uid: string): Promise<UserDocument | null> {
	const snapshot = await getDoc(userRef(uid));
	return mapUserDocument(snapshot);
}

export function subscribeToUserDocument(uid: string, onValue: (document: UserDocument | null) => void): () => void {
	return onSnapshot(userRef(uid), (snapshot) => {
		onValue(mapUserDocument(snapshot));
	});
}

export function subscribeToTodayCount(uid: string, onValue: (count: number) => void): () => void {
	const now = new Date();
	const dayStart = startOfDay(now);
	const dayEnd = addDays(dayStart, 1);
	return onSnapshot(
		query(logsRef(uid), where('timestamp', '>=', dayStart), where('timestamp', '<', dayEnd), orderBy('timestamp')),
		(snapshot) => {
			onValue(snapshot.size);
		},
	);
}

export async function fetchAllLogEntries(uid: string): Promise<SmokeLogEntry[]> {
	const entries: SmokeLogEntry[] = [];
	let cursor: QueryDocumentSnapshot | null = null;

	while (true) {
		const snapshot = await getLogPage(uid, 200, cursor);
		if (snapshot.empty) break;

		snapshot.forEach((docSnapshot) => {
			entries.push(mapLogSnapshot(docSnapshot));
		});

		cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
		if (snapshot.size < 200) break;
	}

	return entries.sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
}

export async function ensureCanonicalUserData(firebaseUid: string, evenUser: EvenUserInfo): Promise<void> {
	const defaults = buildDefaultUserDocument(evenUser);
	// NOTE: longestEverCessation and todayMaxCessation are intentionally excluded here.
	// They are computed values managed exclusively by updateUserMetrics (called on every
	// addSmokeEntry / deleteLogEntry). Writing defaults here would reset them on every boot.
	//
	// The evenUidIndex write is a best-effort lookup table — it lets the app recover
	// a Firebase session when the WebView loses its IndexedDB auth state (e.g. after
	// a Google-link account switch). A separate Cloud Function (resolveEvenSession)
	// reads this index and mints a custom token so the user returns to the same account.
	await Promise.all([
		setDoc(
			userRef(firebaseUid),
			{
				preferences: defaults.preferences,
				providers: {
					google: defaults.providers.google,
					even: {
						...defaults.providers.even,
						linkedAt: serverTimestamp(),
					},
				},
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			},
			{ merge: true },
		),
		setDoc(
			doc(db, 'evenUidIndex', evenUser.uid),
			{ firebaseUid, updatedAt: serverTimestamp() },
			{ merge: true },
		),
	]);
}

export async function upsertEvenProfileFields(uid: string, evenUser: EvenUserInfo): Promise<void> {
	await setDoc(
		userRef(uid),
		{
			providers: {
				even: {
					...buildEvenProvider(evenUser),
					linkedAt: serverTimestamp(),
				},
			},
			updatedAt: serverTimestamp(),
		},
		{ merge: true },
	);
}

export async function upsertAuthProviderFields(uid: string, account: AuthAccountInfo): Promise<void> {
	if (account.authProvider !== 'google') return;
	await setDoc(
		userRef(uid),
		{
			providers: {
				google: {
					uid: account.uid,
					email: account.googleEmail,
					displayName: account.googleDisplayName,
					linkedAt: serverTimestamp(),
				},
			},
			updatedAt: serverTimestamp(),
		},
		{ merge: true },
	);
}

export async function mergeUserData(
	sourceUid: string,
	targetUid: string,
	evenUser: EvenUserInfo,
	account: AuthAccountInfo | null = null,
): Promise<void> {
	if (!sourceUid || !targetUid || sourceUid === targetUid) {
		if (targetUid && account) {
			await upsertAuthProviderFields(targetUid, account);
		}
		return;
	}

	const [targetDocument, sourceDocument, targetLogs, sourceLogs] = await Promise.all([
		fetchUserDocument(targetUid),
		fetchUserDocument(sourceUid),
		fetchAllLogEntries(targetUid),
		fetchAllLogEntries(sourceUid),
	]);

	const mergedDocument = mergeUserDocuments(targetDocument, sourceDocument, evenUser, account);
	const mergedLogs = rebuildIntervals(dedupeLogs([...targetLogs, ...sourceLogs]));

	await rewriteLogs(targetUid, mergedLogs);
	await setDoc(
		userRef(targetUid),
		{
			longestEverCessation: mergedDocument.longestEverCessation,
			todayMaxCessation: mergedDocument.todayMaxCessation,
			preferences: mergedDocument.preferences,
			providers: mergedDocument.providers,
			createdAt: targetDocument?.createdAt ?? sourceDocument?.createdAt ?? serverTimestamp(),
			updatedAt: serverTimestamp(),
		},
		{ merge: true },
	);
	await updateUserMetrics(targetUid, mergedLogs);
	await deleteAllUserData(sourceUid);
}

export async function addSmokeEntry(uid: string, timestamp = new Date()): Promise<string> {
	const entries = await fetchAllLogEntries(uid);
	const previous =
		[...entries]
			.filter((entry) => entry.timestamp.getTime() <= timestamp.getTime())
			.sort((left, right) => right.timestamp.getTime() - left.timestamp.getTime())[0] ?? null;
	const logDoc = doc(logsRef(uid));
	await setDoc(logDoc, {
		timestamp,
		intervalSincePrevious: previous
			? Math.max(0, Math.round((timestamp.getTime() - previous.timestamp.getTime()) / 1000))
			: null,
	});

	const next =
		[...entries]
			.filter((entry) => entry.timestamp.getTime() > timestamp.getTime())
			.sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime())[0] ?? null;
	if (next) {
		await updateDoc(doc(db, 'users', uid, 'logs', next.id), {
			intervalSincePrevious: Math.max(0, Math.round((next.timestamp.getTime() - timestamp.getTime()) / 1000)),
		});
	}

	await updateUserMetrics(
		uid,
		rebuildIntervals([...entries, { id: logDoc.id, timestamp, intervalSincePrevious: null }]),
	);
	return logDoc.id;
}

export async function deleteLogEntry(uid: string, logId: string): Promise<void> {
	const entries = await fetchAllLogEntries(uid);
	const sorted = [...entries].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
	const index = sorted.findIndex((entry) => entry.id === logId);
	if (index === -1) return;

	const next = sorted[index + 1] ?? null;
	const previous = sorted[index - 1] ?? null;
	const batch = writeBatch(db);
	batch.delete(doc(db, 'users', uid, 'logs', logId));

	if (next) {
		batch.update(doc(db, 'users', uid, 'logs', next.id), {
			intervalSincePrevious: previous
				? Math.max(0, Math.round((next.timestamp.getTime() - previous.timestamp.getTime()) / 1000))
				: null,
		});
	}

	await batch.commit();
	await updateUserMetrics(
		uid,
		sorted.filter((entry) => entry.id !== logId),
	);
}

export async function fetchHistoryPage(
	uid: string,
	cursor: HistoryCursor,
): Promise<{ groups: HistoryDayGroup[]; cursor: HistoryCursor; hasMore: boolean }> {
	const groups: HistoryDayGroup[] = [];
	let lastProcessed: QueryDocumentSnapshot | null = cursor;
	let nextCursor: QueryDocumentSnapshot | null = cursor;
	let hasMore = false;
	let pendingCursor = cursor;

	while (groups.length < 30) {
		const snapshot = await getLogPage(uid, 200, pendingCursor);
		if (snapshot.empty) {
			nextCursor = null;
			hasMore = false;
			break;
		}

		let reachedLimit = false;

		for (const docSnapshot of snapshot.docs) {
			const log = mapLogSnapshot(docSnapshot);
			lastProcessed = docSnapshot;
			const dayKey = toDayKey(log.timestamp);
			const lastGroup = groups[groups.length - 1];

			if (!lastGroup || lastGroup.dayKey !== dayKey) {
				if (groups.length === 30) {
					reachedLimit = true;
					break;
				}
				groups.push({
					dayKey,
					date: parseDayKey(dayKey),
					count: 0,
					entries: [],
				});
			}

			const currentGroup = groups[groups.length - 1]!;
			currentGroup.entries.push(log);
			currentGroup.count += 1;
		}

		if (reachedLimit) {
			nextCursor = lastProcessed;
			hasMore = true;
			break;
		}

		pendingCursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
		nextCursor = pendingCursor;
		hasMore = snapshot.size === 200;
		if (snapshot.size < 200) break;
	}

	return { groups, cursor: nextCursor, hasMore };
}

export async function exportLogs(
	uid: string,
): Promise<{ exportedAt: string; logs: Array<Record<string, string | number | null>> }> {
	const entries = await fetchAllLogEntries(uid);
	return {
		exportedAt: new Date().toISOString(),
		logs: entries
			.sort((left, right) => right.timestamp.getTime() - left.timestamp.getTime())
			.map((entry) => ({
				id: entry.id,
				timestamp: entry.timestamp.toISOString(),
				intervalSincePrevious: entry.intervalSincePrevious,
			})),
	};
}

export async function deleteAllUserData(uid: string): Promise<void> {
	await clearLogs(uid);
	await deleteDoc(userRef(uid));
}

export function getHistoryEntriesForMonth(groups: HistoryDayGroup[], month: Date): SmokeLogEntry[] {
	const monthKey = toMonthKey(month);
	return groups.flatMap((group) => (group.dayKey.startsWith(monthKey) ? group.entries : []));
}

export function deriveHistoryGroupsFromLogs(entries: SmokeLogEntry[]): HistoryDayGroup[] {
	return buildHistoryGroups(entries);
}

export async function fetchDailyStats(uid: string, days = 365): Promise<Record<string, number>> {
	const entries = await fetchAllLogEntries(uid);
	const start = addDays(new Date(), -(days - 1));
	const { daily } = deriveStatsFromLogs(entries.filter((entry) => diffCalendarDays(entry.timestamp, start) >= 0));
	return daily;
}

export async function fetchMonthlyStats(uid: string, months = 18): Promise<Record<string, number>> {
	const entries = await fetchAllLogEntries(uid);
	const start = new Date(new Date().getFullYear(), new Date().getMonth() - (months - 1), 1);
	const { monthly } = deriveStatsFromLogs(entries.filter((entry) => entry.timestamp >= start));
	return monthly;
}
