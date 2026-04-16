import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import { appStore } from '../../../app/store';
import { selectHudStatsSummaries } from '../../../app/selectors';
import type { Router, View, ViewKey } from '../../router';
import type { HudLayoutDescriptor } from '../../types';
import { ROOT_LAYOUT, buildFooter, buildHeader } from '../shared-shell';

export class StatsView implements View {
	readonly key: ViewKey = 'stats';
	private router: Router | null = null;

	setRouter(router: Router): void {
		this.router = router;
	}

	layout(): HudLayoutDescriptor {
		return ROOT_LAYOUT;
	}

	contents(): Record<string, string> {
		const state = appStore.getState();
		const summaries = selectHudStatsSummaries(state);
		const stats = summaries[state.statsPeriod];
		const period = stats.period;

		// For year: slice to 6 months around the current month (same as legacy).
		const now = new Date();
		let series = stats.series;
		if (period === 'year') {
			const currMonth = now.getMonth();
			const range = currMonth <= 5 ? 0 : currMonth - 5;
			series = series.slice(range, range + 6);
		}

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
		const gridText = `${lines.join('  •\n')}  •`;
		const body = `[${period.toUpperCase()}]  ${stats.totalSmoked} smoked\n\n----     Average:     ${Math.round(
			stats.weightedAverage,
		)} /day   (${stats.averageIntervalLabel})     ----\n\n${gridText}`;

		return {
			header: buildHeader(now),
			body,
			footer: buildFooter('stats'),
			shield: ' ',
		};
	}

	handleEvent(event: EvenHubEvent): void {
		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType;
		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) {
			this.router?.push('menu');
			return;
		}
		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) {
			appStore.cycleStatsPeriod();
		}
	}
}
