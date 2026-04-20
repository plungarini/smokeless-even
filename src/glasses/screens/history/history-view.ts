import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import { appStore } from '../../../app/store';
import { selectActiveHistoryDay } from '../../../app/selectors';
import { computeWeightedIntervalForDay } from '../../../domain/calculations';
import type { HudHistoryDaySummary } from '../../../domain/types';
import { formatDurationClock } from '../../../lib/time';
import type { Router, View, ViewKey } from '../../router';
import type { HudLayoutDescriptor } from '../../types';
import { alignRow, centerLine } from '../../utils';
import { ROOT_LAYOUT, buildFooter, buildHeader } from '../shared-shell';

// body container: 576 wide, paddingLength 15, borderWidth 1 → inner = 544px
const BODY_INNER_WIDTH_PX = 544;

export class HistoryView implements View {
	readonly key: ViewKey = 'history';
	private router: Router | null = null;

	setRouter(router: Router): void {
		this.router = router;
	}

	layout(): HudLayoutDescriptor {
		return ROOT_LAYOUT;
	}

	contents(): Record<string, string> {
		const state = appStore.getState();
		const selectedDay = selectActiveHistoryDay(state);
		const now = new Date();

		return {
			header: buildHeader(now),
			body: buildHistoryBody(state.selectedHistoryDay, selectedDay),
			footer: buildFooter('history'),
			shield: ' ',
		};
	}

	handleEvent(event: EvenHubEvent): void {
		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType ?? event.listEvent?.eventType;
		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) {
			this.router?.push('menu');
			return;
		}
		if (type === OsEventTypeList.SCROLL_TOP_EVENT) {
			appStore.stepHistoryDay(-1);
			return;
		}
		if (type === OsEventTypeList.SCROLL_BOTTOM_EVENT) {
			appStore.stepHistoryDay(1);
			return;
		}
		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) {
			appStore.resetHistoryDayToToday();
		}
	}
}

function buildHistoryBody(selectedDayKey: string | null, selectedDay: HudHistoryDaySummary | null): string {
	const row = (label: string, value: string | number) =>
		alignRow(`- ${label}`, `${value}`, BODY_INNER_WIDTH_PX);
	const displayDate = selectedDay?.date ?? (selectedDayKey ? parseDayKey(selectedDayKey) : new Date());
	const footer = centerLine('Scroll days  •  Click today', BODY_INNER_WIDTH_PX);

	if (!selectedDay) {
		return `${centerLine(formatHistoryDay(displayDate), BODY_INNER_WIDTH_PX)}\n\n${row('Total smoked', 0)}\n${row('Avg interval', '--:--:--')}\n\n${footer}`;
	}

	const weightedInterval = computeWeightedIntervalForDay(selectedDay.entries);
	const averageIntervalLabel = weightedInterval === null ? '--:--:--' : formatDurationClock(weightedInterval);
	return `${centerLine(formatHistoryDay(selectedDay.date), BODY_INNER_WIDTH_PX)}\n\n${row('Total smoked', selectedDay.count)}\n${row('Avg interval', averageIntervalLabel)}\n\n${footer}`;
}

function formatHistoryDay(date: Date): string {
	const str = date.toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	const now = new Date();
	const normalised = new Date(date);
	normalised.setHours(0, 0, 0, 0);
	now.setHours(0, 0, 0, 0);

	const diff = normalised.getTime() - now.getTime();
	const indicator = diff < 0 ? '<' : diff > 0 ? '>' : '•';

	return `${indicator}   ${str}`;
}

function parseDayKey(dayKey: string): Date {
	return new Date(`${dayKey}T00:00:00`);
}
