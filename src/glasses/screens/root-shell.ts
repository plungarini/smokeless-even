import type { HudHistoryDaySummary } from '../../domain/types';
import { computeWeightedIntervalForDay } from '../../domain/calculations';
import { formatDurationClock } from '../../lib/time';
import { HUD_BORDER_RADIUS, HUD_WIDTH } from '../constants';
import type { HudHomeVisualState, HudLayoutDescriptor, HudRootRoute, HudScreenRenderContext } from '../types';
import { truncate } from '../utils';

const ROOT_LAYOUT: HudLayoutDescriptor = {
	key: 'root-shell',
	textDescriptors: [
		{
			containerID: 1,
			containerName: 'chrome-header',
			xPosition: 0,
			yPosition: 0,
			width: HUD_WIDTH,
			height: 26,
			paddingLength: 4,
		},
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
			isEventCapture: 1,
		},
		{
			containerID: 3,
			containerName: 'chrome-footer',
			xPosition: 0,
			yPosition: 258,
			width: HUD_WIDTH,
			height: 22,
			paddingLength: 2,
		},
	],
};

export class RootShellScreen {
	readonly layout = ROOT_LAYOUT;

	buildHeader(now: Date): string {
		return `${formatHeaderTime(now)}      Smokeless`;
	}

	buildFooter(activeRoute: HudRootRoute): string {
		const labels: HudRootRoute[] = ['home', 'stats', 'history'];
		return labels
			.map((route) => {
				const label = route === 'home' ? 'Home' : route === 'stats' ? 'Stats' : 'History';
				return route === activeRoute ? `[${label}]` : ` ${label} `;
			})
			.join('      ');
	}

	buildHomeBody(context: HudScreenRenderContext, visualState: HudHomeVisualState): string {
		const timerLabel = formatSmokeFreeClock(context.snapshot.home.lastSmokeAt, context.now);

		if (visualState.mode === 'logging') {
			return 'Tap to add smoke\n\nLogging smoke...\n\nPlease hold still';
		}

		if (visualState.mode === 'success') {
			return `Smoke logged\n\n${visualState.todayCount ?? context.snapshot.home.todayCount} today\n\n${timerLabel} smoke-free`;
		}

		if (visualState.mode === 'error') {
			return `Could not log smoke\n\n${truncate(visualState.message ?? 'Please try again.', 30)}\n\n${timerLabel} smoke-free`;
		}

		return `Tap to add smoke\n\n${context.snapshot.home.todayCount} today\n\n${timerLabel} smoke-free`;
	}

	buildStatsBody(context: HudScreenRenderContext): string {
		const stats = context.snapshot.stats[context.ui.statsPeriod];
		const spark = truncate(stats.series.map((item) => item.label).join(' '), 38);
		const counts = truncate(stats.series.map((item) => `${item.label}:${item.count}`).join('  '), 38);
		return `${stats.period.toUpperCase()}  ${stats.totalSmoked} smoked\n\n${truncate(stats.comparisonLabel, 28)}\n\nAvg ${stats.weightedAverage.toFixed(1)}/day\nGap ${stats.averageIntervalLabel}\n\n${spark}\n${counts}`;
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
	return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatHistoryDay(date: Date): string {
	return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function parseDayKey(dayKey: string): Date {
	return new Date(`${dayKey}T00:00:00`);
}
