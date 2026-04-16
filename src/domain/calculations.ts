import type { SmokeLogEntry } from './types';
import { addDays, diffCalendarDays, parseDayKey, startOfDay, toDayKey } from '../lib/time';

const DECAY_LAMBDA = 0.1;

const HEALTH_MILESTONES = [
	{ minutes: 20, label: 'Pulse and blood pressure start to settle.' },
	{ minutes: 8 * 60, label: 'Carbon monoxide levels begin dropping.' },
	{ minutes: 24 * 60, label: 'Your body is clearing more nicotine and smoke residue.' },
	{ minutes: 48 * 60, label: 'Taste and smell start to sharpen again.' },
	{ minutes: 72 * 60, label: 'Breathing can start feeling easier.' },
	{ minutes: 7 * 24 * 60, label: 'Circulation and oxygen delivery keep improving.' },
	{ minutes: 30 * 24 * 60, label: 'A month smoke-free is stacking into measurable progress.' },
];

function median(values: number[]): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

export function computeWeightedMean(samples: Array<{ value: number; weight: number }>): number | null {
	let weightedTotal = 0;
	let totalWeight = 0;

	for (const sample of samples) {
		if (!Number.isFinite(sample.value) || !Number.isFinite(sample.weight) || sample.weight <= 0) continue;
		weightedTotal += sample.value * sample.weight;
		totalWeight += sample.weight;
	}

	return totalWeight > 0 ? weightedTotal / totalWeight : null;
}

export function computeWeightedDailyAverage(
	dailyStats: Record<string, number>,
	createdAt: Date | null,
	now = new Date(),
): number {
	const todayKey = toDayKey(now);
	const minDay = createdAt ? startOfDay(createdAt) : addDays(now, -365);

	const samples: Array<{ value: number; weight: number }> = [];

	for (const [dayKey, count] of Object.entries(dailyStats)) {
		if (count <= 0 || dayKey === todayKey) continue;
		const day = parseDayKey(dayKey);
		if (day < minDay) continue;

		const daysAgo = diffCalendarDays(now, day);
		if (daysAgo <= 0) continue;

		samples.push({
			value: count,
			weight: Math.exp(-DECAY_LAMBDA * daysAgo),
		});
	}

	return computeWeightedMean(samples) ?? 0;
}

/**
 * Sleep-aware weighted average interval for a bounded period (week/month/year).
 *
 * Unlike `computeSleepAwareInterval` this includes today's gaps and weights
 * them most heavily (daysAgo = 0 → weight = 1). Pass entries already filtered
 * to the period range you want to measure.
 *
 * Returns minutes, or null when there are fewer than 2 entries.
 */
export function computeWeightedIntervalForPeriod(entries: SmokeLogEntry[], now = new Date()): number | null {
	const sorted = entries.slice().sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
	if (sorted.length < 2) return null;

	const gaps = sorted
		.map((entry, index) => {
			if (index === 0) return null;
			const previous = sorted[index - 1]!;
			return {
				gapMinutes: (entry.timestamp.getTime() - previous.timestamp.getTime()) / 60_000,
				endedAt: entry.timestamp,
			};
		})
		.filter((v): v is { gapMinutes: number; endedAt: Date } => v !== null);

	const medianGap = median(gaps.map((g) => g.gapMinutes));
	const threshold = Math.max(180, 2.5 * medianGap);

	const samples: Array<{ value: number; weight: number }> = [];
	for (const gap of gaps) {
		if (gap.gapMinutes >= threshold) continue;
		const daysAgo = diffCalendarDays(now, gap.endedAt);
		samples.push({
			value: gap.gapMinutes,
			// Today = weight 1 (max). Each day older reduces weight by e^(-0.1).
			weight: Math.exp(-DECAY_LAMBDA * Math.max(0, daysAgo)),
		});
	}

	return computeWeightedMean(samples);
}

export function computeSleepAwareInterval(entries: SmokeLogEntry[], now = new Date()): number | null {
	const active = entries
		.slice()
		.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

	if (active.length < 2) return null;

	const gaps = active.map((entry, index) => {
		if (index === 0) return null;
		const previous = active[index - 1];
		const gapMinutes = (entry.timestamp.getTime() - previous.timestamp.getTime()) / 60_000;
		return {
			gapMinutes,
			endedAt: entry.timestamp,
		};
	}).filter((value): value is { gapMinutes: number; endedAt: Date } => value !== null);

	const medianGap = median(gaps.map((gap) => gap.gapMinutes));
	const threshold = Math.max(180, 2.5 * medianGap);

	const samples: Array<{ value: number; weight: number }> = [];

	for (const gap of gaps) {
		if (gap.gapMinutes >= threshold) continue;
		if (toDayKey(gap.endedAt) === toDayKey(now)) continue;

		const daysAgo = diffCalendarDays(now, gap.endedAt);
		if (daysAgo <= 0) continue;

		samples.push({
			value: gap.gapMinutes,
			weight: Math.exp(-DECAY_LAMBDA * daysAgo),
		});
	}

	return computeWeightedMean(samples);
}

export function computeWeightedIntervalForDay(entries: SmokeLogEntry[]): number | null {
	const active = entries
		.slice()
		.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

	if (active.length < 2) return null;

	const gaps = active
		.map((entry, index) => {
			if (index === 0) return null;
			const previous = active[index - 1];
			return entry.timestamp.getTime() - previous.timestamp.getTime();
		})
		.filter((gapMs): gapMs is number => gapMs !== null && gapMs >= 0);

	if (gaps.length === 0) return null;

	const samples = gaps.map((gapMs, index) => ({
		value: gapMs,
		// Favor more recent intra-day gaps slightly more than early-day ones.
		weight: Math.exp(-DECAY_LAMBDA * (gaps.length - 1 - index)),
	}));

	return computeWeightedMean(samples);
}

export function computeLongestCessation(entries: SmokeLogEntry[], now = new Date()): number | null {
	const active = entries
		.slice()
		.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

	if (active.length === 0) return null;

	let longestGapMs = Math.max(0, now.getTime() - active[active.length - 1]!.timestamp.getTime());

	for (let index = 1; index < active.length; index += 1) {
		const gapMs = active[index]!.timestamp.getTime() - active[index - 1]!.timestamp.getTime();
		if (gapMs > longestGapMs) {
			longestGapMs = gapMs;
		}
	}

	return longestGapMs;
}

export function getHealthMilestone(lastSmokeAt: Date | null, now = new Date()): string {
	if (!lastSmokeAt) {
		return 'First smoke-free stretch starts with the next skipped cigarette.';
	}

	const smokeFreeMinutes = Math.max(0, Math.floor((now.getTime() - lastSmokeAt.getTime()) / 60_000));
	let current = HEALTH_MILESTONES[0].label;

	for (const milestone of HEALTH_MILESTONES) {
		if (smokeFreeMinutes >= milestone.minutes) {
			current = milestone.label;
		}
	}

	return current;
}
