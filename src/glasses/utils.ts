import { ListContainerProperty, ListItemContainerProperty, TextContainerProperty } from '@evenrealities/even_hub_sdk';
import type { HudHistoryDaySummary } from '../domain/types';
import { formatDayLabel, formatHudLastSmoke, formatLongDate, formatTime } from '../lib/time';
import { HUD_CREATE_TEXT_LIMIT, HUD_WIDTH } from './constants';
import type { HudLayoutDescriptor, HudTextDescriptor } from './types';

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function truncate(value: string, maxLength: number): string {
	if (value.length <= maxLength) return value;
	return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function instantiateLayout(layout: HudLayoutDescriptor, textContents: Record<string, string>) {
	return {
		containerTotalNum: layout.textDescriptors.length + (layout.listObject?.length ?? 0),
		textObject: layout.textDescriptors.map(
			(descriptor) =>
				new TextContainerProperty({
					...descriptor,
					content: textContents[descriptor.containerName] ?? '',
				}),
		),
		listObject: layout.listObject,
	};
}

export function createGhostEventDescriptor(containerID: number, containerName: string): HudTextDescriptor {
	return {
		containerID,
		containerName,
		xPosition: 0,
		yPosition: 0,
		width: 0,
		height: 0,
		paddingLength: 0,
		borderWidth: 0,
		isEventCapture: 1,
	};
}

export function createMenuList(selectedLabels: string[]): ListContainerProperty {
	return new ListContainerProperty({
		xPosition: 60,
		yPosition: 48,
		width: HUD_WIDTH - 120,
		height: 210,
		containerID: 2,
		containerName: 'hud-menu-list',
		borderWidth: 0,
		paddingLength: 0,
		isEventCapture: 1,
		itemContainer: new ListItemContainerProperty({
			itemCount: selectedLabels.length,
			itemWidth: HUD_WIDTH - 120,
			isItemSelectBorderEn: 1,
			itemName: selectedLabels,
		}),
	});
}

export function formatTargetStatus(todayCount: number, dailyTarget: number | null): string {
	if (dailyTarget === null) return 'Tracking only';
	if (todayCount > dailyTarget) return `${todayCount - dailyTarget} over target`;
	if (todayCount === dailyTarget) return 'At target';
	return `${dailyTarget - todayCount} left today`;
}

export function buildSparkline(counts: number[]): string {
	if (counts.length === 0) return '--------';
	const max = Math.max(...counts, 1);
	const chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
	return counts
		.map((count) => {
			const index = Math.round((count / max) * (chars.length - 1));
			return chars[index] ?? chars[0];
		})
		.join('');
}

export function buildStatusBox(title: string, body: string[]): string {
	const lines = body.flatMap((line) => wrapText(line, 42));
	const maxContentWidth = Math.max(title.length + 4, ...lines.map((line) => line.length), 20);
	const top = `╭${`─ ${title} `.padEnd(maxContentWidth + 1, '─')}╮`;
	const middle = lines.map((line) => `│ ${line.padEnd(maxContentWidth, ' ')} │`);
	const bottom = `╰${''.padEnd(maxContentWidth + 2, '─')}╯`;
	const content = [top, ...middle, bottom].join('\n');
	return content.length > HUD_CREATE_TEXT_LIMIT ? content.slice(0, HUD_CREATE_TEXT_LIMIT - 1) : content;
}

export function wrapText(value: string, maxLineLength: number): string[] {
	const words = value.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return [''];

	const lines: string[] = [];
	let current = '';

	for (const word of words) {
		const next = current ? `${current} ${word}` : word;
		if (next.length > maxLineLength && current) {
			lines.push(current);
			current = word;
		} else {
			current = next;
		}
	}

	if (current) lines.push(current);
	return lines;
}

export function formatHistoryRow(day: HudHistoryDaySummary, selected: boolean): string {
	const newest = day.entries[0]?.timestamp ?? null;
	const oldest = day.entries[day.entries.length - 1]?.timestamp ?? null;
	const range =
		newest && oldest ? `${formatTime(oldest)} to ${formatTime(newest)}` : newest ? formatTime(newest) : 'No times logged';
	return `${selected ? '>' : ' '} ${truncate(`${formatDayLabel(day.date)}  ${day.count} smokes`, 43)}\n  ${truncate(range, 40)}`;
}

export function formatHistoryDetailPage(day: HudHistoryDaySummary, pageIndex: number, rowsPerPage: number): { body: string; totalPages: number } {
	const lines = day.entries.length === 0
		? ['No smokes logged for this day.']
		: day.entries.map((entry, index) => {
			const next = day.entries[index + 1]?.timestamp ?? null;
			return `${String(day.entries.length - index).padStart(2, ' ')}  ${formatTime(entry.timestamp)}  ${next ? formatGap(entry.timestamp, next) : 'latest'}`;
		});
	const totalPages = Math.max(1, Math.ceil(lines.length / rowsPerPage));
	const pageLines = lines.slice(pageIndex * rowsPerPage, pageIndex * rowsPerPage + rowsPerPage);
	const content = `${formatLongDate(day.date)}\n${day.count} smokes\n\n${pageLines.join('\n')}`;
	return {
		body: content.length > HUD_CREATE_TEXT_LIMIT ? content.slice(0, HUD_CREATE_TEXT_LIMIT - 1) : content,
		totalPages,
	};
}

function formatGap(later: Date, earlier: Date): string {
	const totalMinutes = Math.max(0, Math.round((later.getTime() - earlier.getTime()) / 60_000));
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
	if (hours > 0) return `${hours}h`;
	return `${minutes}m`;
}

export function formatHomeLastSmoke(date: Date | null, now: Date): string {
	return date ? formatHudLastSmoke(date, now) : 'none yet';
}

export function shortClockTime(date: Date | null): string {
	if (!date) return '--:--';
	return formatTime(date);
}
