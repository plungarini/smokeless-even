import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import { appStore } from '../../../app/store';
import { selectActiveHistoryDay } from '../../../app/selectors';
import { computeWeightedIntervalForDay } from '../../../domain/calculations';
import type { HudHistoryDaySummary } from '../../../domain/types';
import { formatDurationClock } from '../../../lib/time';
import type { Router, View, ViewKey } from '../../router';
import type { HudLayoutDescriptor } from '../../types';
import { ROOT_LAYOUT, buildFooter, buildHeader } from '../shared-shell';

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
	const padValue = (val: string | number) => `${val}`.padStart(14, ' ');
	const displayDate = selectedDay?.date ?? (selectedDayKey ? parseDayKey(selectedDayKey) : new Date());

	if (!selectedDay) {
		return `${formatHistoryDay(displayDate)}\n\n- Total smoked:    ${padValue(0)}\n- Avg interval: ${padValue('--:--:--')}\n\nScroll days  •  Click today`;
	}

	const weightedInterval = computeWeightedIntervalForDay(selectedDay.entries);
	const averageIntervalLabel = weightedInterval === null ? '--:--:--' : formatDurationClock(weightedInterval);
	return `${formatHistoryDay(selectedDay.date)}\n\n- Total smoked:    ${padValue(selectedDay.count)}\n- Avg interval: ${padValue(averageIntervalLabel)}\n\nScroll days  •  Click today`;
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
