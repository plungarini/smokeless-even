import { computeWeightedIntervalForDay } from '../../domain/calculations';
import type { HudHistoryDaySummary } from '../../domain/types';
import { formatDurationClock } from '../../lib/time';
import { HUD_BORDER_RADIUS, HUD_WIDTH } from '../constants';
import type { HudHomeVisualState, HudLayoutDescriptor, HudRootRoute, HudScreenRenderContext } from '../types';
import { truncate } from '../utils';

const getFooter = (id: number) => ({
	containerID: id,
	containerName: 'chrome-footer',
	xPosition: 13,
	yPosition: 251,
	width: 270,
	height: 35,
	paddingLength: 4,
});

const getHeader = (id = 1) => ({
	containerID: id,
	containerName: 'chrome-header',
	xPosition: 12,
	yPosition: 0,
	width: 200,
	height: 40,
	paddingLength: 4,
});

const ROOT_LAYOUT: HudLayoutDescriptor = {
	key: 'root-shell',
	textDescriptors: [
		getHeader(),
		{
			containerID: 2,
			containerName: 'root-body',
			xPosition: 0,
			yPosition: 37,
			width: HUD_WIDTH,
			height: 213,
			paddingLength: 15,
			borderWidth: 1,
			borderRadius: HUD_BORDER_RADIUS,
			isEventCapture: 1,
		},
		getFooter(3),
	],
};

const HISTORY_LAYOUT: HudLayoutDescriptor = {
	key: 'history-shell',
	textDescriptors: [
		getHeader(),
		{
			containerID: 2,
			containerName: 'root-body',
			xPosition: 0,
			yPosition: 34,
			width: HUD_WIDTH,
			height: 214,
			paddingLength: 10,
			borderWidth: 1,
			borderRadius: HUD_BORDER_RADIUS,
			isEventCapture: 0,
		},
		getFooter(3),
		{
			containerID: 4,
			containerName: 'history-event-shield',
			xPosition: 0,
			yPosition: 0,
			width: HUD_WIDTH,
			height: 288,
			paddingLength: 0,
			borderWidth: 0,
			isEventCapture: 1,
		},
	],
};

export class RootShellScreen {
	readonly layout = ROOT_LAYOUT;
	readonly historyLayout = HISTORY_LAYOUT;

	buildHeader(now: Date): string {
		return `${formatHeaderTime(now)}   •   Smokeless`;
	}

	buildFooter(activeRoute: HudRootRoute): string {
		const labels: HudRootRoute[] = ['home', 'stats', 'history'];
		return labels
			.map((route) => {
				const labels: Record<HudRootRoute, string> = {
					home: 'Home',
					stats: 'Stats',
					history: 'History',
				};
				return route === activeRoute ? `[${labels[route]}]` : ` ${labels[route]} `;
			})
			.join('      ');
	}

	buildHomeBody(context: HudScreenRenderContext, visualState: HudHomeVisualState): string {
		const timerLabel = formatSmokeFreeClock(context.snapshot.home.lastSmokeAt, context.now);
		const statusSpacing = '                               ';
		const bodySpacing = '                               ';
		const valueSpacing = '                            ';
		const padValueSpace = (val: string | number) => `${val}`.padStart(valueSpacing.length, ' ');

		if (visualState.mode === 'logging') {
			return `${statusSpacing}--     Logging smoke...     --\n\n${bodySpacing}• Today:    ${padValueSpace('...')}\n\n${bodySpacing}• Last:${padValueSpace('--:--:--')}`;
		}

		if (visualState.mode === 'success') {
			return `${statusSpacing}--       Smoke logged       --\n\n${bodySpacing}• Today:    ${padValueSpace(visualState.todayCount ?? context.snapshot.home.todayCount)}\n\n${bodySpacing}• Last:${padValueSpace(timerLabel)}`;
		}

		if (visualState.mode === 'error') {
			return `${statusSpacing}--   Could not log smoke    --\n\n${truncate(visualState.message ?? 'Please try again.', 30)}\n\n${bodySpacing}• Last:${padValueSpace(timerLabel)}`;
		}

		return `${statusSpacing}--     Tap to add a Log     --\n\n${bodySpacing}• Today:    ${padValueSpace(context.snapshot.home.todayCount)}\n\n${bodySpacing}• Last:${padValueSpace(timerLabel)}`;
	}

	buildStatsBody(context: HudScreenRenderContext): string {
		const stats = context.snapshot.stats[context.ui.statsPeriod];
		const period = stats.period;

		let series = stats.series;
		if (period === 'year') {
			const currMonth = context.now.getMonth();
			const range = currMonth <= 5 ? 0 : currMonth - 5;
			series = series.slice(range, range + 6);
		}

		series = series.map((i) => ({ ...i, count: 2000 }));

		const itemsPerLine = 4;
		const lines: string[] = [];

		for (let i = 0; i < series.length; i += itemsPerLine) {
			const row = series.slice(i, i + itemsPerLine);
			lines.push(
				row
					.map((item) => {
						const countStr = String(item.count).padStart(6, ' ');
						return `•  ${item.label}: ${countStr}`;
					})
					.join('  '),
			);
		}

		const gridText = lines.join('  •\n') + '  •';

		return `[${period.toUpperCase()}]  ${stats.totalSmoked} smoked\n\n----     Average:     ${Math.round(stats.weightedAverage)} /day   (${stats.averageIntervalLabel})     ----\n\n${gridText}`;
	}

	buildHistoryBody(selectedDayKey: string | null, selectedDay: HudHistoryDaySummary | null): string {
		const displayDate = selectedDay?.date ?? (selectedDayKey ? parseDayKey(selectedDayKey) : new Date());
		if (!selectedDay) {
			return `${formatHistoryDay(displayDate)}\n\nTotal smoked: 0\nAvg interval: 00:00:00\n\nScroll days  •  Click today`;
		}

		const weightedInterval = computeWeightedIntervalForDay(selectedDay.entries);
		const averageIntervalLabel = weightedInterval === null ? '00:00:00' : formatDurationClock(weightedInterval);
		return `${formatHistoryDay(selectedDay.date)}\n\nTotal smoked: ${selectedDay.count}\nAvg interval: ${averageIntervalLabel}\n\nScroll days  •  Click today`;
	}
}

function formatHeaderTime(now: Date): string {
	return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function formatSmokeFreeClock(lastSmokeAt: Date | null, now: Date): string {
	if (!lastSmokeAt) return '--:--:--';
	const deltaMs = Math.max(0, now.getTime() - lastSmokeAt.getTime());
	const totalSeconds = Math.floor(deltaMs / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatHistoryDay(date: Date): string {
	return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function parseDayKey(dayKey: string): Date {
	return new Date(`${dayKey}T00:00:00`);
}
