import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import { RootShellScreen } from '../screens/root-shell';
import type { HomeViewController as HomeViewControllerContract, HudHomeVisualState, HudIntent, HudScreenRenderContext } from '../types';

export class HomeViewController implements HomeViewControllerContract {
	constructor(private readonly screen: RootShellScreen) {}

	buildLayout() {
		return this.screen.layout;
	}

	buildContent(context: HudScreenRenderContext, visualState: HudHomeVisualState) {
		return {
			'chrome-header': this.screen.buildHeader(context.now),
			'root-body': this.screen.buildHomeBody(context, visualState),
			'chrome-footer': this.screen.buildFooter('home'),
		};
	}

	async handleEvent(event: EvenHubEvent, _context: HudScreenRenderContext): Promise<HudIntent[]> {
		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType;
		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) return [{ type: 'openMenu' }];
		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) return [];
		return [];
	}

	getUpgradeableContainers(): string[] {
		return ['chrome-header', 'root-body', 'chrome-footer'];
	}
}
