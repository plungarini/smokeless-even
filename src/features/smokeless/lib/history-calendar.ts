import type { HistoryDayGroup, SmokeEntry } from '../../../domain/types';
import { addDays } from '../../../lib/time';

export function monthStart(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function shiftMonth(date: Date, delta: number): Date {
	return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function buildCalendarDays(month: Date): Date[] {
	const start = monthStart(month);
	const firstCell = addDays(start, -start.getDay());
	return Array.from({ length: 35 }, (_, index) => addDays(firstCell, index));
}

export function formatMonthHeading(date: Date): string {
	return date.toLocaleDateString([], {
		month: 'long',
		year: 'numeric',
	});
}

export function formatShortDate(date: Date): string {
	return date.toLocaleDateString([], {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export function formatIntervalShort(later: Date, earlier: Date | null): string {
	if (!earlier) return '—';
	const totalMinutes = Math.max(0, Math.round((later.getTime() - earlier.getTime()) / 60000));
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
	if (hours > 0) return `${hours}h`;
	return `${minutes}m`;
}

export function getHistoryEntriesForDay(groups: HistoryDayGroup[], dayKey: string): SmokeEntry[] {
	return groups.find((group) => group.dayKey === dayKey)?.entries ?? [];
}
