import type {
	AuthAccountInfo,
	EvenUserInfo,
	HudPendingAction,
	HudPhase,
	HudStatsPeriod,
	SmokeLogEntry,
	UserDocument,
} from '../domain/types';
import type { AuthMode } from '../services/auth-mode';
import { monthStart } from '../features/smokeless/lib/history-calendar';
import type { AppTab } from '../features/smokeless/ui/types';
import { combineDateAndTime, toDayKey, toMonthKey } from '../lib/time';
import {
	addSmokeEntry as dbAddSmoke,
	deleteAllUserData as dbDeleteAll,
	deleteLogEntry as dbDeleteEntry,
	exportLogs as dbExportLogs,
} from '../services/db.service';

export interface AppState {
	// Phase / bootstrap status
	phase: HudPhase;
	statusMessage: string | null;
	bootstrapErrorDetail: string | null;

	// Identity
	evenUser: EvenUserInfo | null;
	accountInfo: AuthAccountInfo | null;
	canonicalUid: string | null;
	userDocument: UserDocument | null;
	authMode: AuthMode | null;

	// Data — page-specific, no allSmokeEntries
	todayEntries: SmokeLogEntry[];
	dailyStats: Record<string, number>;
	monthlyStats: Record<string, number>;
	statsPeriodEntries: SmokeLogEntry[];
	statsPeriodLoading: boolean;
	historyDayEntries: SmokeLogEntry[];
	monthDayKeys: string[];
	historyLoading: boolean;
	todayCount: number;

	// UX navigation (shared between web + glasses)
	tab: AppTab;
	statsPeriod: HudStatsPeriod;
	selectedHistoryDay: string;
	historyMonth: Date;

	// Optimistic / pending
	optimisticLastSmokeAt: Date | null;
	mutating: boolean;
	hudPendingAction: HudPendingAction;

	// Time
	today: string; // dayKey, only bumps at midnight

	// Fast-path last smoke (hydrated before full logs load)
	lastSmokeAt: Date | null;
}

const initialState: AppState = {
	phase: 'booting',
	statusMessage: null,
	bootstrapErrorDetail: null,

	evenUser: null,
	accountInfo: null,
	canonicalUid: null,
	userDocument: null,
	authMode: null,

	todayEntries: [],
	dailyStats: {},
	monthlyStats: {},
	statsPeriodEntries: [],
	statsPeriodLoading: false,
	historyDayEntries: [],
	monthDayKeys: [],
	historyLoading: false,
	todayCount: 0,

	tab: 'home',
	statsPeriod: 'week',
	selectedHistoryDay: toDayKey(new Date()),
	historyMonth: monthStart(new Date()),

	optimisticLastSmokeAt: null,
	mutating: false,
	hudPendingAction: null,

	today: toDayKey(new Date()),
	lastSmokeAt: null,
};

type Listener = () => void;

export class AppStore {
	private state: AppState = initialState;
	private readonly listeners = new Set<Listener>();

	getState(): AppState {
		return this.state;
	}

	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private commit(next: AppState): void {
		if (next === this.state) return;
		this.state = next;
		this.notify();
	}

	private notify(): void {
		for (const listener of this.listeners) {
			try {
				listener();
			} catch (error) {
				console.error('[AppStore] listener error', error);
			}
		}
	}

	// ── Phase / status ────────────────────────────────────────────────

	setPhase(phase: HudPhase, statusMessage: string | null = null, errorDetail: string | null = null): void {
		this.commit({
			...this.state,
			phase,
			statusMessage,
			bootstrapErrorDetail: errorDetail ?? this.state.bootstrapErrorDetail,
		});
	}

	setBootstrapError(detail: string | null): void {
		this.commit({ ...this.state, bootstrapErrorDetail: detail });
	}

	// ── Identity ──────────────────────────────────────────────────────

	setEvenUser(user: EvenUserInfo | null): void {
		this.commit({ ...this.state, evenUser: user });
	}

	setAccountInfo(account: AuthAccountInfo | null): void {
		this.commit({ ...this.state, accountInfo: account });
	}

	setCanonicalUid(uid: string | null): void {
		this.commit({ ...this.state, canonicalUid: uid });
	}

	setUserDocument(doc: UserDocument | null): void {
		this.commit({ ...this.state, userDocument: doc });
	}

	setAuthMode(mode: AuthMode | null): void {
		if (this.state.authMode === mode) return;
		this.commit({ ...this.state, authMode: mode });
	}

	// ── Data — page-specific setters ──────────────────────────────────

	setTodayEntries(entries: SmokeLogEntry[]): void {
		this.commit({ ...this.state, todayEntries: entries });
	}

	setDailyStats(stats: Record<string, number>): void {
		this.commit({ ...this.state, dailyStats: stats });
	}

	setMonthlyStats(stats: Record<string, number>): void {
		this.commit({ ...this.state, monthlyStats: stats });
	}

	setStatsPeriodEntries(entries: SmokeLogEntry[]): void {
		this.commit({ ...this.state, statsPeriodEntries: entries, statsPeriodLoading: false });
	}

	setStatsPeriodLoading(loading: boolean): void {
		if (this.state.statsPeriodLoading === loading) return;
		this.commit({ ...this.state, statsPeriodLoading: loading });
	}

	setHistoryDayEntries(entries: SmokeLogEntry[]): void {
		this.commit({ ...this.state, historyDayEntries: entries });
	}

	setMonthDayKeys(keys: string[]): void {
		this.commit({ ...this.state, monthDayKeys: keys });
	}

	setTodayCount(count: number): void {
		this.commit({ ...this.state, todayCount: count });
	}

	setHistoryLoading(loading: boolean): void {
		if (this.state.historyLoading === loading) return;
		this.commit({ ...this.state, historyLoading: loading });
	}

	// ── UX navigation ─────────────────────────────────────────────────

	setTab(tab: AppTab): void {
		if (this.state.tab === tab) return;
		// Reset history day selection unless navigating to history explicitly.
		const next: AppState = { ...this.state, tab };
		if (tab === 'history' && this.state.selectedHistoryDay === '') {
			next.selectedHistoryDay = toDayKey(new Date());
		}
		this.commit(next);
	}

	goHome(): void {
		this.setTab('home');
	}

	goStats(): void {
		this.setTab('stats');
	}

	goHistory(): void {
		this.setTab('history');
	}

	goSettings(): void {
		this.setTab('settings');
	}

	setStatsPeriod(period: HudStatsPeriod): void {
		if (this.state.statsPeriod === period) return;
		this.commit({ ...this.state, statsPeriod: period });
	}

	cycleStatsPeriod(): void {
		const periods: HudStatsPeriod[] = ['week', 'month', 'year'];
		const idx = periods.indexOf(this.state.statsPeriod);
		const next = periods[(idx + 1) % periods.length] ?? 'week';
		this.commit({ ...this.state, statsPeriod: next, tab: 'stats' });
	}

	setHistoryDay(dayKey: string): void {
		if (this.state.selectedHistoryDay === dayKey) return;
		this.commit({
			...this.state,
			tab: 'history',
			selectedHistoryDay: dayKey,
			historyMonth: monthStart(parseDayKeyLocal(dayKey)),
		});
	}

	stepHistoryDay(delta: -1 | 1): void {
		const base = parseDayKeyLocal(this.state.selectedHistoryDay);
		const next = new Date(base.getFullYear(), base.getMonth(), base.getDate() + delta);
		this.setHistoryDay(toDayKey(next));
	}

	resetHistoryDayToToday(): void {
		this.setHistoryDay(toDayKey(new Date()));
	}

	setHistoryMonth(month: Date): void {
		this.commit({ ...this.state, historyMonth: monthStart(month) });
	}

	// ── Optimistic / mutation flags ───────────────────────────────────

	setMutating(mutating: boolean): void {
		if (this.state.mutating === mutating) return;
		this.commit({ ...this.state, mutating });
	}

	setHudPendingAction(action: HudPendingAction): void {
		if (this.state.hudPendingAction === action) return;
		this.commit({ ...this.state, hudPendingAction: action });
	}

	setOptimisticLastSmokeAt(at: Date | null): void {
		this.commit({ ...this.state, optimisticLastSmokeAt: at });
	}

	applyOptimisticSmoke(at: Date): void {
		this.commit({
			...this.state,
			todayCount: this.state.todayCount + 1,
			optimisticLastSmokeAt: at,
			lastSmokeAt: at,
		});
	}

	rollbackOptimisticSmoke(
		prevTodayCount: number,
		prevOptimistic: Date | null,
		prevLastSmokeAt: Date | null,
	): void {
		this.commit({
			...this.state,
			todayCount: prevTodayCount,
			optimisticLastSmokeAt: prevOptimistic,
			lastSmokeAt: prevLastSmokeAt,
		});
	}

	// ── Time ──────────────────────────────────────────────────────────

	setToday(dayKey: string): void {
		if (this.state.today === dayKey) return;
		this.commit({
			...this.state,
			today: dayKey,
			// Re-derive todayCount from dailyStats for the new day.
			todayCount: this.state.dailyStats[dayKey] ?? 0,
		});
	}

	setLastSmokeAt(at: Date | null): void {
		if (this.state.lastSmokeAt === at) return;
		this.commit({ ...this.state, lastSmokeAt: at });
	}

	// ── Async actions ─────────────────────────────────────────────────
	//
	// These are the canonical action entry points for both React and glasses.
	// They own the optimistic-update + Firestore-write + refresh cycle.

	private smokeInFlight = false;

	/**
	 * Log a smoke with optimistic count bump. Deduplicated via `smokeInFlight`
	 * so rapid double-clicks are safe.
	 */
	async logSmoke(): Promise<LogSmokeResult> {
		const { canonicalUid, mutating, todayCount, optimisticLastSmokeAt } = this.state;
		if (!canonicalUid) {
			return { ok: false, errorMessage: 'Smokeless is still syncing your account.' };
		}
		if (mutating || this.smokeInFlight) {
			return { ok: false, errorMessage: 'A smoke is already being logged.' };
		}

		this.smokeInFlight = true;
		this.setMutating(true);
		this.setHudPendingAction('logSmoke');
		const snapshotTodayCount = todayCount;
		const snapshotOptimistic = optimisticLastSmokeAt;
		const snapshotLastSmokeAt = this.state.lastSmokeAt;
		const optimisticNow = new Date();
		this.applyOptimisticSmoke(optimisticNow);

		try {
			const logId = await dbAddSmoke(canonicalUid, optimisticNow);
			this.applyIncrementalAdd({ id: logId, timestamp: optimisticNow, intervalSincePrevious: null });
			return { ok: true, todayCount: snapshotTodayCount + 1, loggedAt: optimisticNow };
		} catch (error) {
			console.error('[Smokeless] add smoke failed', error);
			this.rollbackOptimisticSmoke(snapshotTodayCount, snapshotOptimistic, snapshotLastSmokeAt);
			return { ok: false, errorMessage: 'Could not log smoke.' };
		} finally {
			this.smokeInFlight = false;
			this.setHudPendingAction(null);
			this.setMutating(false);
		}
	}

	async addPastEntry(dateInputValue: string, timeInputValue: string): Promise<boolean> {
		const { canonicalUid, mutating, selectedHistoryDay } = this.state;
		if (!canonicalUid || mutating) return false;
		this.setMutating(true);
		try {
			const entryDate = combineDateAndTime(dateInputValue, timeInputValue);
			const logId = await dbAddSmoke(canonicalUid, entryDate);
			const entry: SmokeLogEntry = { id: logId, timestamp: entryDate, intervalSincePrevious: null };
			this.applyIncrementalAdd(entry);
			this.setHistoryDay(dateInputValue);
			// If the new day differs from the old selection, seed historyDayEntries
			// so the UI shows the entry immediately (re-fetched by App.tsx on next render).
			if (dateInputValue !== selectedHistoryDay) {
				this.commit({ ...this.state, historyDayEntries: [entry] });
			}
			return true;
		} catch (error) {
			console.error('[Smokeless] add past entry failed', error);
			return false;
		} finally {
			this.setMutating(false);
		}
	}

	async deleteEntry(id: string): Promise<boolean> {
		const { canonicalUid, mutating } = this.state;
		if (!canonicalUid || mutating) return false;
		this.setMutating(true);
		try {
			await dbDeleteEntry(canonicalUid, id);
			this.applyIncrementalDelete(id);
			return true;
		} catch (error) {
			console.error('[Smokeless] delete entry failed', error);
			return false;
		} finally {
			this.setMutating(false);
		}
	}

	async exportLogs(): Promise<unknown | null> {
		const { canonicalUid } = this.state;
		if (!canonicalUid) return null;
		try {
			return await dbExportLogs(canonicalUid);
		} catch (error) {
			console.error('[Smokeless] export failed', error);
			return null;
		}
	}

	async deleteAllData(): Promise<boolean> {
		const { canonicalUid } = this.state;
		if (!canonicalUid) return false;
		this.setMutating(true);
		try {
			await dbDeleteAll(canonicalUid);
			this.commit({
				...this.state,
				todayEntries: [],
				dailyStats: {},
				monthlyStats: {},
				statsPeriodEntries: [],
				historyDayEntries: [],
				monthDayKeys: [],
				todayCount: 0,
				userDocument: null,
				optimisticLastSmokeAt: null,
			});
			return true;
		} catch (error) {
			console.error('[Smokeless] delete-all failed', error);
			return false;
		} finally {
			this.setMutating(false);
		}
	}

	// ── Incremental state updates ─────────────────────────────────────

	private applyIncrementalAdd(entry: SmokeLogEntry): void {
		const todayKey = this.state.today;
		const dayKey = toDayKey(entry.timestamp);
		const monthKey = toMonthKey(entry.timestamp);

		const nextTodayEntries =
			dayKey === todayKey
				? [...this.state.todayEntries, entry].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
				: this.state.todayEntries;

		const nextDaily = {
			...this.state.dailyStats,
			[dayKey]: (this.state.dailyStats[dayKey] ?? 0) + 1,
		};
		const nextMonthly = {
			...this.state.monthlyStats,
			[monthKey]: (this.state.monthlyStats[monthKey] ?? 0) + 1,
		};

		const nextHistoryDayEntries =
			dayKey === this.state.selectedHistoryDay
				? [...this.state.historyDayEntries, entry].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
				: this.state.historyDayEntries;

		this.commit({
			...this.state,
			todayEntries: nextTodayEntries,
			dailyStats: nextDaily,
			monthlyStats: nextMonthly,
			historyDayEntries: nextHistoryDayEntries,
			todayCount: this.state.todayCount + 1,
			optimisticLastSmokeAt: null,
			lastSmokeAt: entry.timestamp,
		});
	}

	private applyIncrementalDelete(entryId: string): void {
		const entry = this.state.todayEntries.find((e) => e.id === entryId)
			?? this.state.historyDayEntries.find((e) => e.id === entryId);

		const nextToday = this.state.todayEntries.filter((e) => e.id !== entryId);
		const nextHistory = this.state.historyDayEntries.filter((e) => e.id !== entryId);

		if (!entry) {
			this.commit({
				...this.state,
				todayEntries: nextToday,
				historyDayEntries: nextHistory,
			});
			return;
		}

		const isTodayEntry = toDayKey(entry.timestamp) === this.state.today;
		const dayKey = toDayKey(entry.timestamp);
		const monthKey = toMonthKey(entry.timestamp);

		this.commit({
			...this.state,
			todayEntries: nextToday,
			dailyStats: {
				...this.state.dailyStats,
				[dayKey]: Math.max(0, (this.state.dailyStats[dayKey] ?? 1) - 1),
			},
			monthlyStats: {
				...this.state.monthlyStats,
				[monthKey]: Math.max(0, (this.state.monthlyStats[monthKey] ?? 1) - 1),
			},
			historyDayEntries: nextHistory,
			todayCount: isTodayEntry ? Math.max(0, this.state.todayCount - 1) : this.state.todayCount,
		});
	}

	// ── Full reset (used by rebootForUid) ─────────────────────────────

	resetForReboot(): void {
		this.commit({
			...initialState,
			// Preserve UX preferences across reboot.
			tab: this.state.tab,
			statsPeriod: this.state.statsPeriod,
			authMode: this.state.authMode,
			today: toDayKey(new Date()),
			selectedHistoryDay: toDayKey(new Date()),
			historyMonth: monthStart(new Date()),
		});
	}
}

function parseDayKeyLocal(dayKey: string): Date {
	return new Date(`${dayKey}T00:00:00`);
}

export interface LogSmokeResult {
	ok: boolean;
	todayCount?: number;
	loggedAt?: Date;
	errorMessage?: string;
}

export const appStore = new AppStore();
