import { addDays, toDayKey, toMonthKey } from '../../../lib/time';
import type { StatsPeriod } from '../ui/types';
import type { SmokeLogEntry } from '../../../domain/types';

export interface StatsSeriesItem {
	key: string;
	label: string;
	count: number;
	isCurrent: boolean;
	start: Date;
	end: Date;
}

function startOfWeek(date: Date): Date {
	const day = date.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
}

function startOfYear(date: Date): Date {
	return new Date(date.getFullYear(), 0, 1);
}

function endOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function getSelectedPeriodRange(period: StatsPeriod, now: Date): { start: Date; end: Date } {
	if (period === 'week') {
		return {
			start: startOfWeek(now),
			end: endOfDay(now),
		};
	}

	if (period === 'month') {
		return {
			start: new Date(now.getFullYear(), now.getMonth(), 1),
			end: endOfDay(now),
		};
	}

	return {
		start: startOfYear(now),
		end: endOfDay(now),
	};
}

export function getSelectedPeriodAverageCigs(period: StatsPeriod, total: number, now: Date): number {
	if (total <= 0) return 0;
	if (period === 'week') {
		return Math.round(total / 7);
	}

	if (period === 'month') {
		return Math.round(total / Math.max(1, now.getDate()));
	}

	const start = startOfYear(now);
	const elapsedDays = Math.max(1, Math.floor((endOfDay(now).getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
	return Math.round(total / elapsedDays);
}

export function getAverageCigsAcrossNonEmptyBuckets(items: StatsSeriesItem[]): number {
	const nonEmpty = items.filter((item) => item.count > 0);
	if (nonEmpty.length === 0) return 0;
	const total = nonEmpty.reduce((sum, item) => sum + item.count, 0);
	return Math.round(total / nonEmpty.length);
}

export function getSelectedPeriodAverageIntervalMinutes(period: StatsPeriod, entries: SmokeLogEntry[], now: Date): number | null {
	const { start, end } = getSelectedPeriodRange(period, now);
	const filtered = entries
		.filter((entry) => entry.timestamp >= start && entry.timestamp <= end)
		.slice()
		.sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());

	if (filtered.length < 2) return null;

	let totalGapMinutes = 0;
	let gapCount = 0;

	for (let index = 1; index < filtered.length; index += 1) {
		const previous = filtered[index - 1]!;
		const current = filtered[index]!;
		totalGapMinutes += (current.timestamp.getTime() - previous.timestamp.getTime()) / 60_000;
		gapCount += 1;
	}

	return gapCount > 0 ? totalGapMinutes / gapCount : null;
}

export function getAverageIntervalAcrossNonEmptyBuckets(entries: SmokeLogEntry[], items: StatsSeriesItem[]): number | null {
	const nonEmptyItems = items.filter((item) => item.count > 0);
	if (nonEmptyItems.length === 0) return null;

	const intervalValues: number[] = [];

	for (const item of nonEmptyItems) {
		const bucketEntries = entries
			.filter((entry) => entry.timestamp >= item.start && entry.timestamp <= item.end)
			.slice()
			.sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());

		if (bucketEntries.length < 2) continue;

		let totalGapMinutes = 0;
		for (let index = 1; index < bucketEntries.length; index += 1) {
			totalGapMinutes += (bucketEntries[index]!.timestamp.getTime() - bucketEntries[index - 1]!.timestamp.getTime()) / 60_000;
		}
		intervalValues.push(totalGapMinutes / (bucketEntries.length - 1));
	}

	if (intervalValues.length === 0) return null;
	return intervalValues.reduce((sum, value) => sum + value, 0) / intervalValues.length;
}

export function formatStatsIntervalLabel(totalMinutes: number | null, options?: { padHours?: boolean }): string {
	if (totalMinutes === null || !Number.isFinite(totalMinutes) || totalMinutes <= 0) return '0:00';
	const roundedMinutes = Math.max(1, Math.round(totalMinutes));
	const hours = Math.floor(roundedMinutes / 60);
	const minutes = roundedMinutes % 60;
	const hourText = options?.padHours ? String(hours).padStart(2, '0') : String(hours);
	return `${hourText}:${String(minutes).padStart(2, '0')}`;
}

export function buildStatsSeries(period: StatsPeriod, dailyStats: Record<string, number>, monthlyStats: Record<string, number>, now: Date): StatsSeriesItem[] {
	if (period === 'week') {
		const weekStart = startOfWeek(now);
		return Array.from({ length: 7 }, (_, index) => {
			const date = addDays(weekStart, index);
			return {
				key: toDayKey(date),
				label: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][index] ?? '',
				count: dailyStats[toDayKey(date)] ?? 0,
				isCurrent: toDayKey(date) === toDayKey(now),
				start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
				end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
			};
		});
	}

	if (period === 'month') {
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		const ranges = [
			{ label: 'W1', from: 1, to: 7 },
			{ label: 'W2', from: 8, to: 14 },
			{ label: 'W3', from: 15, to: 21 },
			{ label: 'W4', from: 22, to: monthEnd.getDate() },
		];

		return ranges.map((range) => {
			let count = 0;
			for (let day = range.from; day <= range.to; day += 1) {
				const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
				count += dailyStats[toDayKey(date)] ?? 0;
			}
			const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), range.from, 0, 0, 0, 0);
			const end = new Date(monthStart.getFullYear(), monthStart.getMonth(), range.to, 23, 59, 59, 999);
			return {
				key: `${toMonthKey(monthStart)}:${range.label}`,
				label: range.label,
				count,
				isCurrent: now >= start && now <= end,
				start,
				end,
			};
		});
	}

	return Array.from({ length: 12 }, (_, index) => {
		const date = new Date(startOfYear(now).getFullYear(), index, 1);
		const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
		const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
		return {
			key: toMonthKey(date),
			label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index] ?? '',
			count: monthlyStats[toMonthKey(date)] ?? 0,
			isCurrent: index === now.getMonth(),
			start,
			end,
		};
	});
}

export function getSelectedPeriodTotal(period: StatsPeriod, dailyStats: Record<string, number>, monthlyStats: Record<string, number>, now: Date): number {
	if (period === 'week') {
		const weekStart = startOfWeek(now);
		let total = 0;
		for (let index = 0; index < 7; index += 1) {
			total += dailyStats[toDayKey(addDays(weekStart, index))] ?? 0;
		}
		return total;
	}

	if (period === 'month') {
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		let total = 0;
		for (let day = 1; day <= daysInMonth; day += 1) {
			total += dailyStats[toDayKey(new Date(now.getFullYear(), now.getMonth(), day))] ?? 0;
		}
		return total;
	}

	let total = 0;
	for (let month = 0; month < 12; month += 1) {
		total += monthlyStats[toMonthKey(new Date(now.getFullYear(), month, 1))] ?? 0;
	}
	return total;
}

export function getWeightedPeriodBaseline(period: StatsPeriod, weightedAverage: number, now: Date): number {
	if (period === 'week') return weightedAverage * 7;
	if (period === 'month') {
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		return weightedAverage * daysInMonth;
	}
	return weightedAverage * 365;
}

export function getPeriodComparisonLabel(period: StatsPeriod, total: number, weightedAverage: number, now: Date): string {
	const baseline = getWeightedPeriodBaseline(period, weightedAverage, now);
	if (baseline <= 0) return `0% vs last ${period}`;
	const delta = ((total - baseline) / baseline) * 100;
	const rounded = Math.round(delta);
	const sign = rounded > 0 ? '+' : '';
	return `${sign}${rounded}% vs last ${period}`;
}
