import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import type { HudHistoryDaySummary } from '../../domain/types';
import { RootShellScreen } from '../screens/root-shell';
import type { HistoryViewController as HistoryViewControllerContract, HudIntent, HudScreenRenderContext } from '../types';

export class HistoryViewController implements HistoryViewControllerContract {
	constructor(private readonly screen: RootShellScreen) {}

	buildLayout() {
		return this.screen.layout;
	}

	buildContent(context: HudScreenRenderContext, selectedDay: HudHistoryDaySummary | null) {
		return {
			'chrome-header': this.screen.buildHeader(context.now),
			'root-body': this.screen.buildHistoryBody(context.ui.historySelectedDayKey, selectedDay),
			'chrome-footer': this.screen.buildFooter('history'),
		};
	}

	async handleEvent(event: EvenHubEvent, _context: HudScreenRenderContext, _selectedDay: HudHistoryDaySummary | null): Promise<HudIntent[]> {
		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType;
		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) return [{ type: 'openMenu' }];
		if (type === OsEventTypeList.SCROLL_TOP_EVENT) return [{ type: 'historyPrevDay' }];
		if (type === OsEventTypeList.SCROLL_BOTTOM_EVENT) return [{ type: 'historyNextDay' }];
		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) return [{ type: 'historyResetToday' }];
		return [];
	}

	getUpgradeableContainers(): string[] {
		return ['chrome-header', 'root-body', 'chrome-footer'];
	}
}
