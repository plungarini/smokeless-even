import { addDays, toDayKey, toMonthKey } from '../../../lib/time';
import type { StatsPeriod } from '../ui/types';

function startOfWeek(date: Date): Date {
	const day = date.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
}

function startOfYear(date: Date): Date {
	return new Date(date.getFullYear(), 0, 1);
}

export function buildStatsSeries(period: StatsPeriod, dailyStats: Record<string, number>, monthlyStats: Record<string, number>, now: Date) {
	if (period === 'week') {
		const weekStart = startOfWeek(now);
		return Array.from({ length: 7 }, (_, index) => {
			const date = addDays(weekStart, index);
			return {
				key: toDayKey(date),
				label: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][index] ?? '',
				count: dailyStats[toDayKey(date)] ?? 0,
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
			return {
				key: `${toMonthKey(monthStart)}:${range.label}`,
				label: range.label,
				count,
			};
		});
	}

	return Array.from({ length: 12 }, (_, index) => {
		const date = new Date(startOfYear(now).getFullYear(), index, 1);
		return {
			key: toMonthKey(date),
			label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index] ?? '',
			count: monthlyStats[toMonthKey(date)] ?? 0,
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
