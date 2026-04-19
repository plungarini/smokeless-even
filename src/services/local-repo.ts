import { computeLongestCessation } from '../domain/calculations';
import type {
	AuthAccountInfo,
	EvenUserInfo,
	HistoryDayGroup,
	SmokeLogEntry,
	UserDocument,
} from '../domain/types';
import { addDays, parseDayKey, startOfDay, toDayKey, toMonthKey } from '../lib/time';
import { bridgeStorageGet, bridgeStorageRemove, bridgeStorageSet } from './bridge-storage';

// ── Storage keys ───────────────────────────────────────────────────
// Keyed by canonical local UID (the Even UID). Even though only one user
// can be signed into Even on a given device, scoping by UID keeps data
// isolated if the device is ever used by a different Even account.

const logsKey = (uid: string) => `smokeless:local:logs:${uid}`;
const userKey = (uid: string) => `smokeless:local:user:${uid}`;

const DEFAULT_PREFERENCES = {
	locale: 'en',
	themeMode: 'dark',
	weekStart: 'Monday',
};

// ── Pub/sub ────────────────────────────────────────────────────────
// In Local mode we have no onSnapshot — emit manually on writes so the
// store's subscribe* hooks receive updates.

type Listener = () => void;
const userDocListeners = new Map<string, Set<Listener>>();
const logsListeners = new Map<string, Set<Listener>>();

function notify(map: Map<string, Set<Listener>>, uid: string): void {
	const set = map.get(uid);
	if (!set) return;
	for (const listener of set) {
		try {
			listener();
		} catch (error) {
			console.error('[local-repo] listener error', error);
		}
	}
}

function addListener(map: Map<string, Set<Listener>>, uid: string, listener: Listener): () => void {
	let set = map.get(uid);
	if (!set) {
		set = new Set();
		map.set(uid, set);
	}
	set.add(listener);
	return () => {
		set!.delete(listener);
	};
}

// ── Raw JSON I/O ───────────────────────────────────────────────────

interface StoredLogEntry {
	id: string;
	timestamp: string; // ISO
	intervalSincePrevious: number | null;
}

interface StoredEvenProvider {
	uid: string;
	name: string;
	avatar: string;
	country: string;
	linkedAt: string | null;
}

interface StoredGoogleProvider {
	uid: string;
	email: string;
	displayName: string;
	linkedAt: string | null;
}

interface StoredUserDocument {
	createdAt: string | null;
	updatedAt: string | null;
	longestEverCessation: number;
	todayMaxCessation: { value: number; lastUpdated: string | null } | null;
	preferences: UserDocument['preferences'];
	providers: {
		even: StoredEvenProvider | null;
		google: StoredGoogleProvider | null;
	};
}

async function readLogs(uid: string): Promise<StoredLogEntry[]> {
	const raw = await bridgeStorageGet(logsKey(uid));
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

async function writeLogs(uid: string, entries: StoredLogEntry[]): Promise<void> {
	await bridgeStorageSet(logsKey(uid), JSON.stringify(entries));
	notify(logsListeners, uid);
}

async function readUser(uid: string): Promise<StoredUserDocument | null> {
	const raw = await bridgeStorageGet(userKey(uid));
	if (!raw) return null;
	try {
		return JSON.parse(raw) as StoredUserDocument;
	} catch {
		return null;
	}
}

async function writeUser(uid: string, doc: StoredUserDocument): Promise<void> {
	await bridgeStorageSet(userKey(uid), JSON.stringify(doc));
	notify(userDocListeners, uid);
}

// ── Mapping ────────────────────────────────────────────────────────

function toEntry(stored: StoredLogEntry): SmokeLogEntry {
	return {
		id: stored.id,
		timestamp: new Date(stored.timestamp),
		intervalSincePrevious: stored.intervalSincePrevious,
	};
}

function toStoredEntry(entry: SmokeLogEntry): StoredLogEntry {
	return {
		id: entry.id,
		timestamp: entry.timestamp.toISOString(),
		intervalSincePrevious: entry.intervalSincePrevious,
	};
}

function toUserDoc(stored: StoredUserDocument | null): UserDocument | null {
	if (!stored) return null;
	return {
		createdAt: stored.createdAt ? new Date(stored.createdAt) : null,
		updatedAt: stored.updatedAt ? new Date(stored.updatedAt) : null,
		longestEverCessation: stored.longestEverCessation,
		todayMaxCessation: stored.todayMaxCessation
			? {
					value: stored.todayMaxCessation.value,
					lastUpdated: stored.todayMaxCessation.lastUpdated ? new Date(stored.todayMaxCessation.lastUpdated) : null,
				}
			: null,
		preferences: stored.preferences,
		providers: {
			even: stored.providers.even
				? {
						uid: stored.providers.even.uid,
						name: stored.providers.even.name,
						avatar: stored.providers.even.avatar,
						country: stored.providers.even.country,
						linkedAt: stored.providers.even.linkedAt ? new Date(stored.providers.even.linkedAt) : null,
					}
				: null,
			google: stored.providers.google
				? {
						uid: stored.providers.google.uid,
						email: stored.providers.google.email,
						displayName: stored.providers.google.displayName,
						linkedAt: stored.providers.google.linkedAt ? new Date(stored.providers.google.linkedAt) : null,
					}
				: null,
		},
	};
}

// ── Pure helpers (mirrored from firestore.ts) ─────────────────────

function rebuildIntervals(entries: SmokeLogEntry[]): SmokeLogEntry[] {
	const sorted = [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
	return sorted.map((entry, idx) => {
		const prev = sorted[idx - 1];
		return {
			id: entry.id,
			timestamp: entry.timestamp,
			intervalSincePrevious: prev
				? Math.max(0, Math.round((entry.timestamp.getTime() - prev.timestamp.getTime()) / 1000))
				: null,
		};
	});
}

function buildTodayMaxCessation(entries: SmokeLogEntry[], now = new Date()) {
	const dayStart = startOfDay(now);
	const sorted = [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
	let maxSeconds = 0;
	let hasSmokesToday = false;
	let previousTimestamp: Date | null = null;
	for (const entry of sorted) {
		if (entry.timestamp < dayStart) {
			previousTimestamp = entry.timestamp;
			continue;
		}
		hasSmokesToday = true;
		if (previousTimestamp !== null) {
			const gapSeconds = Math.max(0, Math.round((entry.timestamp.getTime() - previousTimestamp.getTime()) / 1000));
			maxSeconds = Math.max(maxSeconds, gapSeconds);
		}
		previousTimestamp = entry.timestamp;
	}
	if (!hasSmokesToday) return null;
	return { value: maxSeconds, lastUpdated: now };
}

function newId(): string {
	// Bridge storage is keyed by uid already; collision chance is negligible
	// across a single user's own device. Date+random is sufficient.
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function recomputeMetrics(uid: string, entries: SmokeLogEntry[]): Promise<void> {
	const now = new Date();
	const existing = (await readUser(uid)) ?? buildDefaultStoredUser(null, now);
	const max = buildTodayMaxCessation(entries, now);
	const updated: StoredUserDocument = {
		...existing,
		longestEverCessation: Math.round((computeLongestCessation(entries, now) ?? 0) / 1000),
		todayMaxCessation: max
			? { value: max.value, lastUpdated: max.lastUpdated.toISOString() }
			: null,
		updatedAt: now.toISOString(),
	};
	await writeUser(uid, updated);
}

function buildDefaultStoredUser(evenUser: EvenUserInfo | null, now: Date): StoredUserDocument {
	return {
		createdAt: now.toISOString(),
		updatedAt: now.toISOString(),
		longestEverCessation: 0,
		todayMaxCessation: null,
		preferences: DEFAULT_PREFERENCES,
		providers: {
			even: evenUser
				? {
						uid: evenUser.uid,
						name: evenUser.name,
						avatar: evenUser.avatar,
						country: evenUser.country,
						linkedAt: now.toISOString(),
					}
				: null,
			google: null,
		},
	};
}

// ── Public API (mirrors firestore.ts shape) ───────────────────────

export async function fetchUserDocument(uid: string): Promise<UserDocument | null> {
	return toUserDoc(await readUser(uid));
}

export function subscribeToUserDocument(
	uid: string,
	onValue: (document: UserDocument | null) => void,
): () => void {
	const emit = () => void fetchUserDocument(uid).then(onValue);
	const unsub = addListener(userDocListeners, uid, emit);
	void emit();
	return unsub;
}

export function subscribeToTodayCount(uid: string, onValue: (count: number) => void): () => void {
	const emit = async () => {
		const entries = await fetchAllLogEntries(uid);
		const today = toDayKey(new Date());
		onValue(entries.filter((e) => toDayKey(e.timestamp) === today).length);
	};
	const unsub = addListener(logsListeners, uid, () => void emit());
	void emit();
	return unsub;
}

export async function fetchAllLogEntries(uid: string): Promise<SmokeLogEntry[]> {
	const stored = await readLogs(uid);
	return stored.map(toEntry).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export async function ensureCanonicalUserData(uid: string, evenUser: EvenUserInfo): Promise<void> {
	const existing = await readUser(uid);
	const now = new Date();
	if (!existing) {
		await writeUser(uid, buildDefaultStoredUser(evenUser, now));
		return;
	}
	// Refresh even-provider fields on every boot.
	const updated: StoredUserDocument = {
		...existing,
		providers: {
			...existing.providers,
			even: {
				uid: evenUser.uid,
				name: evenUser.name,
				avatar: evenUser.avatar,
				country: evenUser.country,
				linkedAt: existing.providers.even?.linkedAt ?? now.toISOString(),
			},
		},
		updatedAt: now.toISOString(),
	};
	await writeUser(uid, updated);
}

export async function upsertAuthProviderFields(_uid: string, _account: AuthAccountInfo): Promise<void> {
	// Local mode has no google provider to record.
}

export async function addSmokeEntry(uid: string, timestamp = new Date()): Promise<string> {
	const entries = await fetchAllLogEntries(uid);
	const id = newId();
	const withNew = rebuildIntervals([...entries, { id, timestamp, intervalSincePrevious: null }]);
	await writeLogs(uid, withNew.map(toStoredEntry));
	await recomputeMetrics(uid, withNew);
	return id;
}

export async function deleteLogEntry(uid: string, logId: string): Promise<void> {
	const entries = await fetchAllLogEntries(uid);
	const filtered = rebuildIntervals(entries.filter((e) => e.id !== logId));
	await writeLogs(uid, filtered.map(toStoredEntry));
	await recomputeMetrics(uid, filtered);
}

export async function deleteAllUserData(uid: string): Promise<void> {
	await bridgeStorageRemove(logsKey(uid));
	await bridgeStorageRemove(userKey(uid));
	notify(logsListeners, uid);
	notify(userDocListeners, uid);
}

export async function exportLogs(
	uid: string,
): Promise<{ exportedAt: string; logs: Array<Record<string, string | number | null>> }> {
	const entries = await fetchAllLogEntries(uid);
	return {
		exportedAt: new Date().toISOString(),
		logs: entries
			.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
			.map((e) => ({
				id: e.id,
				timestamp: e.timestamp.toISOString(),
				intervalSincePrevious: e.intervalSincePrevious,
			})),
	};
}

// History pagination is a no-op in Local mode — we always return everything
// since Bridge Storage reads are cheap and total volume is small.
export type LocalHistoryCursor = null;

export async function fetchHistoryPage(
	uid: string,
	_cursor: LocalHistoryCursor,
): Promise<{ groups: HistoryDayGroup[]; cursor: LocalHistoryCursor; hasMore: boolean }> {
	const entries = await fetchAllLogEntries(uid);
	const descending = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
	const groups: HistoryDayGroup[] = [];
	for (const entry of descending) {
		const dayKey = toDayKey(entry.timestamp);
		const last = groups[groups.length - 1];
		if (!last || last.dayKey !== dayKey) {
			groups.push({ dayKey, date: parseDayKey(dayKey), count: 0, entries: [] });
		}
		const current = groups[groups.length - 1]!;
		current.entries.push(entry);
		current.count += 1;
	}
	return { groups, cursor: null, hasMore: false };
}

export async function fetchDailyStats(uid: string, days = 365): Promise<Record<string, number>> {
	const entries = await fetchAllLogEntries(uid);
	const start = addDays(new Date(), -(days - 1));
	const counts: Record<string, number> = {};
	for (const entry of entries) {
		if (entry.timestamp < start) continue;
		const key = toDayKey(entry.timestamp);
		counts[key] = (counts[key] ?? 0) + 1;
	}
	return counts;
}

export async function fetchMonthlyStats(uid: string, months = 18): Promise<Record<string, number>> {
	const entries = await fetchAllLogEntries(uid);
	const start = new Date(new Date().getFullYear(), new Date().getMonth() - (months - 1), 1);
	const counts: Record<string, number> = {};
	for (const entry of entries) {
		if (entry.timestamp < start) continue;
		const key = toMonthKey(entry.timestamp);
		counts[key] = (counts[key] ?? 0) + 1;
	}
	return counts;
}
