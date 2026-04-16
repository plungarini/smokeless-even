import type { HistoryDayGroup, SmokeLogEntry } from '../../../domain/types';
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

export function formatIntervalSecondsShort(totalSeconds: number | null): string {
	if (totalSeconds === null) return 'First';
	const seconds = Math.max(0, Math.round(totalSeconds));
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;
	if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
	if (hours > 0) return remainingSeconds > 0 ? `${hours}h ${remainingSeconds}s` : `${hours}h`;
	if (minutes > 0) return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
	return `${remainingSeconds}s`;
}

export function getHistoryEntriesForDay(groups: HistoryDayGroup[], dayKey: string): SmokeLogEntry[] {
	return groups.find((group) => group.dayKey === dayKey)?.entries ?? [];
}
