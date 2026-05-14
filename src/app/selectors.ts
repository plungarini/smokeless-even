import { computeWeightedDailyAverage, computeWeightedDailyAverageForPeriod, computeWeightedIntervalForPeriod } from '../domain/calculations';
import type {
	HudHistoryDaySummary,
	HudSnapshot,
	HudStatsPeriod,
	HudStatsSummary,
} from '../domain/types';
import {
	buildStatsSeries,
	formatStatsIntervalLabel,
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
	globalWeightedAverage: number,
	referenceNow: Date,
): HudStatsSummary => {
	const series = buildStatsSeries(period, state.dailyStats, state.monthlyStats, referenceNow);
	const totalSmoked = getSelectedPeriodTotal(period, state.dailyStats, state.monthlyStats, referenceNow);

	// Use statsPeriodEntries if available (fetched on-demand), fall back to todayEntries.
	const periodEntries =
		state.statsPeriodEntries.length > 0
			? state.statsPeriodEntries
			: state.todayEntries;

	// Period-aware weighted daily average — only counts days WITHIN the
	// selected period that have data, with exponential decay weighting.
	const periodStart = series[0]?.start;
	const periodWeightedAverage = periodStart
		? computeWeightedDailyAverageForPeriod(state.dailyStats, periodStart, referenceNow)
		: globalWeightedAverage;

	return {
		period,
		totalSmoked,
		comparisonLabel: getPeriodComparisonLabel(period, totalSmoked, globalWeightedAverage, referenceNow),
		weightedAverage: periodWeightedAverage,
		averageIntervalLabel: formatStatsIntervalLabel(
			computeWeightedIntervalForPeriod(periodEntries, referenceNow),
			{ padHours: true },
		),
		series,
	};
};

export const selectHudStatsSummaries = memoize<AppState, unknown, Record<HudStatsPeriod, HudStatsSummary>>(
	(s) => [
		dictIdentity(s.dailyStats),
		dictIdentity(s.monthlyStats),
		s.statsPeriodEntries,
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

/** Last smoke time. Falls back to the most recent today entry when lastSmokeAt is null. */
export function selectLastSmokeAt(state: AppState): Date | null {
	return state.lastSmokeAt ?? state.todayEntries[state.todayEntries.length - 1]?.timestamp ?? null;
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
		s.historyDayEntries,
		s.monthDayKeys,
		s.historyLoading,
		s.hudPendingAction,
		s.today,
	].join('|'),
	(s) => {
		const selectedDay: HudHistoryDaySummary | null = s.selectedHistoryDay
			? {
					dayKey: s.selectedHistoryDay,
					date: parseDayKey(s.selectedHistoryDay),
					count: s.historyDayEntries.length,
					entries: s.historyDayEntries,
				}
			: null;
		return {
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
				days: selectedDay ? [selectedDay] : [],
				hasMore: false,
				loading: s.historyLoading,
			},
			pendingAction: s.hudPendingAction,
		};
	},
);

/** The currently-selected history day, or null if the selection has no entries. */
export function selectActiveHistoryDay(state: AppState): HudHistoryDaySummary | null {
	if (!state.selectedHistoryDay) return null;
	if (state.historyDayEntries.length === 0) return null;
	return {
		dayKey: state.selectedHistoryDay,
		date: parseDayKey(state.selectedHistoryDay),
		count: state.historyDayEntries.length,
		entries: state.historyDayEntries,
	};
}

/** Set of dayKeys in history that have at least one entry (for calendar rendering). */
export const selectHistoryDaysWithEntries = memoize<AppState, unknown, Set<string>>(
	(s) => s.monthDayKeys,
	(s) => new Set(s.monthDayKeys),
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
