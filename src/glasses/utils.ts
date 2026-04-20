import { TextContainerProperty } from '@evenrealities/even_hub_sdk';
import { getTextWidth } from '@evenrealities/pretext';
import type { HudHistoryDaySummary } from '../domain/types';
import { formatDayLabel, formatHudLastSmoke, formatLongDate, formatTime } from '../lib/time';
import { HUD_CREATE_TEXT_LIMIT } from './constants';
import type { HudLayoutDescriptor, HudTextDescriptor } from './types';

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function truncate(value: string, maxLength: number): string {
	if (value.length <= maxLength) return value;
	return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

const CONTAINER_CONTENT_LIMIT = 950;

export function instantiateLayout(layout: HudLayoutDescriptor, textContents: Record<string, string>) {
	return {
		containerTotalNum: layout.textDescriptors.length + (layout.listObject?.length ?? 0),
		textObject: layout.textDescriptors.map(
			(descriptor) =>
				new TextContainerProperty({
					...descriptor,
					content: truncate(textContents[descriptor.containerName] ?? ' ', CONTAINER_CONTENT_LIMIT),
				}),
		),
		listObject: layout.listObject,
		imageObject: layout.imageObject,
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
	const lines = body.flatMap((line) => wrapText(line, 50));
	const top = `╭${`─    ${title}    `.padEnd(36, '─')}╮\n│ `;
	const middle = lines.map((line) => `│   ${line}`);
	const bottom = `│ \n╰${''.padEnd(15, '─')}`;
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
		newest && oldest
			? `${formatTime(oldest)} to ${formatTime(newest)}`
			: newest
				? formatTime(newest)
				: 'No times logged';
	return `${selected ? '>' : ' '} ${truncate(`${formatDayLabel(day.date)}  ${day.count} smokes`, 43)}\n  ${truncate(range, 40)}`;
}

export function formatHistoryDetailPage(
	day: HudHistoryDaySummary,
	pageIndex: number,
	rowsPerPage: number,
): { body: string; totalPages: number } {
	const lines =
		day.entries.length === 0
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

const SPACE_WIDTH = getTextWidth(' ') || 5;

// Leave a small cushion so rounding / kerning can never push a line past the
// inner width — LVGL wraps aggressively and even 1 px over drops to a new line.
const WRAP_SAFETY_PX = 4;

/** Returns spaces whose rendered width is <= targetPx (floor, never overflows). */
function spacesForPx(targetPx: number): string {
	if (targetPx <= 0) return '';
	const count = Math.floor(targetPx / SPACE_WIDTH);
	return count > 0 ? ' '.repeat(count) : '';
}

/** Left-aligns text in a fixed pixel-width cell, padding the right with spaces. */
export function padToWidth(text: string, widthPx: number): string {
	const gap = widthPx - getTextWidth(text) - WRAP_SAFETY_PX;
	return gap <= 0 ? text : `${text}${spacesForPx(gap)}`;
}

/** Centers a single line of text within an inner pixel width using space padding. */
export function centerLine(text: string, innerWidthPx: number): string {
	const w = getTextWidth(text);
	const leftPx = Math.max(0, (innerWidthPx - WRAP_SAFETY_PX - w) / 2);
	return `${spacesForPx(leftPx)}${text}`;
}

/**
 * Aligns a two-column row: `left` on the left edge, `right` on the right edge.
 * Uses the non-monospaced font metrics so columns align per-pixel.
 */
export function alignRow(left: string, right: string, innerWidthPx: number): string {
	const available = innerWidthPx - WRAP_SAFETY_PX - getTextWidth(left) - getTextWidth(right);
	if (available <= 0) return `${left} ${right}`;
	return `${left}${spacesForPx(available)}${right}`;
}

export function shortClockTime(date: Date | null): string {
	if (!date) return '--:--';
	return formatTime(date);
}
