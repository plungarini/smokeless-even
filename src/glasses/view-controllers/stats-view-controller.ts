import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import { RootShellScreen } from '../screens/root-shell';
import type { HudIntent, HudScreenRenderContext, StatsViewController as StatsViewControllerContract } from '../types';

export class StatsViewController implements StatsViewControllerContract {
	constructor(private readonly screen: RootShellScreen) {}

	buildLayout() {
		return this.screen.layout;
	}

	buildContent(context: HudScreenRenderContext) {
		return {
			'chrome-header': this.screen.buildHeader(context.now),
			'root-body': this.screen.buildStatsBody(context),
			'chrome-footer': this.screen.buildFooter('stats'),
		};
	}

	async handleEvent(event: EvenHubEvent, _context: HudScreenRenderContext): Promise<HudIntent[]> {
		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType;
		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) return [{ type: 'openMenu' }];
		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) return [{ type: 'cycleStatsPeriod' }];
		return [];
	}

	getUpgradeableContainers(): string[] {
		return ['chrome-header', 'root-body', 'chrome-footer'];
	}
}
