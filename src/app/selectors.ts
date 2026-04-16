import { computeWeightedDailyAverage } from '../domain/calculations';
import type {
	HudHistoryDaySummary,
	HudSnapshot,
	HudStatsPeriod,
	HudStatsSummary,
} from '../domain/types';
import {
	buildStatsSeries,
	formatStatsIntervalLabel,
	getAverageCigsAcrossNonEmptyBuckets,
	getAverageIntervalAcrossNonEmptyBuckets,
	getPeriodComparisonLabel,
	getSelectedPeriodTotal,
} from '../features/smokeless/lib/stats-series';
import type { AppState } from './store';

/**
 * Tiny single-argument memoizer.
 * Re-runs `fn` only when `keyFn(state)` produces a different identity from the
 * previous call. Deliberately minimal — no cache size, no async, no deep equals.
 */
export function memoize<T, K, R>(keyFn: (input: T) => K, fn: (input: T) => R): (input: T) => R {
	let lastKey: K | typeof UNSET = UNSET;
	let lastResult: R;
	return (input) => {
		const key = keyFn(input);
		if (lastKey !== UNSET && key === lastKey) return lastResult;
		lastKey = key;
		lastResult = fn(input);
		return lastResult;
	};
}

const UNSET = Symbol('memoize-unset');

/** A day-level "now" used by anything that would otherwise drift per-second. */
export function selectReferenceNow(state: AppState): Date {
	return parseDayKey(state.today);
}

/** The weighted daily average, re-computed when dailyStats or user createdAt change. */
export const selectWeightedAverage = memoize<AppState, unknown, number>(
	(s) => `${dictIdentity(s.dailyStats)}:${s.userDocument?.createdAt?.getTime() ?? ''}:${s.today}`,
	(s) => computeWeightedDailyAverage(s.dailyStats, s.userDocument?.createdAt ?? null, parseDayKey(s.today)),
);

const buildHudSummary = (
	period: HudStatsPeriod,
	state: AppState,
	weightedAverage: number,
	referenceNow: Date,
): HudStatsSummary => {
	const series = buildStatsSeries(period, state.dailyStats, state.monthlyStats, referenceNow);
	const totalSmoked = getSelectedPeriodTotal(period, state.dailyStats, state.monthlyStats, referenceNow);
	return {
		period,
		totalSmoked,
		comparisonLabel: getPeriodComparisonLabel(period, totalSmoked, weightedAverage, referenceNow),
		weightedAverage: getAverageCigsAcrossNonEmptyBuckets(series),
		averageIntervalLabel: formatStatsIntervalLabel(
			getAverageIntervalAcrossNonEmptyBuckets(state.allSmokeEntries, series),
			{ padHours: true },
		),
		series,
	};
};

export const selectHudStatsSummaries = memoize<AppState, unknown, Record<HudStatsPeriod, HudStatsSummary>>(
	(s) => [
		dictIdentity(s.dailyStats),
		dictIdentity(s.monthlyStats),
		s.allSmokeEntries,
		s.today,
		s.userDocument?.createdAt?.getTime() ?? '',
	].join('|'),
	(s) => {
		const referenceNow = parseDayKey(s.today);
		const weightedAverage = selectWeightedAverage(s);
		return {
			week: buildHudSummary('week', s, weightedAverage, referenceNow),
			month: buildHudSummary('month', s, weightedAverage, referenceNow),
			year: buildHudSummary('year', s, weightedAverage, referenceNow),
		};
	},
);

/** Last smoke time including optimistic update. */
export function selectLastSmokeAt(state: AppState): Date | null {
	return state.optimisticLastSmokeAt ?? state.allSmokeEntries[state.allSmokeEntries.length - 1]?.timestamp ?? null;
}

/** The HudSnapshot the glasses views consume. */
export const selectHudSnapshot = memoize<AppState, unknown, HudSnapshot>(
	(s) => [
		s.phase,
		s.statusMessage,
		s.todayCount,
		selectLastSmokeAt(s)?.getTime() ?? '',
		selectWeightedAverage(s),
		dictIdentity(s.dailyStats),
		dictIdentity(s.monthlyStats),
		s.historyGroups,
		s.historyHasMore,
		s.historyLoading,
		s.hudPendingAction,
		s.today,
	].join('|'),
	(s) => ({
		phase: s.phase,
		statusMessage: s.statusMessage,
		home: {
			todayCount: s.todayCount,
			lastSmokeAt: selectLastSmokeAt(s),
			dailyTarget: null,
			weightedAverage: selectWeightedAverage(s),
		},
		stats: selectHudStatsSummaries(s),
		history: {
			days: s.historyGroups.map((group) => ({
				dayKey: group.dayKey,
				date: group.date,
				count: group.count,
				entries: group.entries,
			})),
			hasMore: s.historyHasMore,
			loading: s.historyLoading || s.hudPendingAction === 'loadMoreHistory',
		},
		pendingAction: s.hudPendingAction,
	}),
);

/** The currently-selected history day, or null if the selection has no entries. */
export function selectActiveHistoryDay(state: AppState): HudHistoryDaySummary | null {
	if (!state.selectedHistoryDay) {
		return state.historyGroups[0] ?? null;
	}
	return state.historyGroups.find((group) => group.dayKey === state.selectedHistoryDay) ?? null;
}

/** Set of dayKeys in history that have at least one entry (for calendar rendering). */
export const selectHistoryDaysWithEntries = memoize<AppState, unknown, Set<string>>(
	(s) => s.historyGroups,
	(s) => new Set(s.historyGroups.map((group) => group.dayKey)),
);

// ── helpers ──────────────────────────────────────────────────────────

/**
 * Return a stable key representing a dictionary's identity. As long as the
 * store creates a new object reference when it mutates, comparing by reference
 * is enough — this is just a tagged wrapper to make the memoize keys readable.
 */
function dictIdentity<T>(dict: T): T {
	return dict;
}

function parseDayKey(dayKey: string): Date {
	return new Date(`${dayKey}T00:00:00`);
}
