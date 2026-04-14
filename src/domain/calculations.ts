import type { SmokeEntry, UserProfile } from './types';
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

export function computeWeightedDailyAverage(
	dailyStats: Record<string, number>,
	createdAt: Date | null,
	now = new Date(),
): number {
	const todayKey = toDayKey(now);
	const minDay = createdAt ? startOfDay(createdAt) : addDays(now, -365);

	let totalWeight = 0;
	let weightedTotal = 0;

	for (const [dayKey, count] of Object.entries(dailyStats)) {
		if (count <= 0 || dayKey === todayKey) continue;
		const day = parseDayKey(dayKey);
		if (day < minDay) continue;

		const daysAgo = diffCalendarDays(now, day);
		if (daysAgo <= 0) continue;

		const weight = Math.exp(-DECAY_LAMBDA * daysAgo);
		totalWeight += weight;
		weightedTotal += count * weight;
	}

	return totalWeight > 0 ? weightedTotal / totalWeight : 0;
}

export function computeSleepAwareInterval(entries: SmokeEntry[], now = new Date()): number | null {
	const active = entries
		.filter((entry) => !entry.deletedAt)
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

	let weightedTotal = 0;
	let totalWeight = 0;

	for (const gap of gaps) {
		if (gap.gapMinutes >= threshold) continue;
		if (toDayKey(gap.endedAt) === toDayKey(now)) continue;

		const daysAgo = diffCalendarDays(now, gap.endedAt);
		if (daysAgo <= 0) continue;

		const weight = Math.exp(-DECAY_LAMBDA * daysAgo);
		weightedTotal += gap.gapMinutes * weight;
		totalWeight += weight;
	}

	return totalWeight > 0 ? weightedTotal / totalWeight : null;
}

export function computeLongestCessation(entries: SmokeEntry[], now = new Date()): number | null {
	const active = entries
		.filter((entry) => !entry.deletedAt)
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

export function computeDailyTarget(profile: UserProfile | null, now = new Date()): number | null {
	if (!profile) return null;
	if (profile.quitProgram === 'minimum') return null;
	if (profile.quitProgram === 'fixed') return Math.max(0, Math.round(profile.programTargetCigarettes));

	const startDate = profile.programStartDate ?? profile.createdAt ?? now;
	const targetDate = profile.programTargetDate;

	if (!targetDate) return profile.cigarettesPerDay;

	const totalProgramDays = Math.max(1, diffCalendarDays(targetDate, startDate));
	const day = Math.max(0, Math.min(totalProgramDays, diffCalendarDays(now, startDate)));
	const baseline = profile.cigarettesPerDay;
	const finalTarget = profile.programTargetCigarettes;
	const target = baseline - (baseline - finalTarget) * (day / totalProgramDays);

	return Math.max(finalTarget, Math.round(target));
}

export function computeMoneySaved(profile: UserProfile | null, weightedAverage: number, now = new Date()): number {
	if (!profile) return 0;
	const pricePerCigarette = profile.packPrice / Math.max(profile.cigarettesPerPack, 1);
	const start = profile.programStartDate ?? profile.createdAt ?? now;
	const daysSinceStart = Math.max(1, (now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
	return (profile.cigarettesPerDay - weightedAverage) * pricePerCigarette * daysSinceStart;
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
