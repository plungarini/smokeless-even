import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import { buildMenuContents, buildMenuLayout, getMenuViewByIndex, MENU_ITEMS } from '../screens/menu-screen';
import type { HudIntent, HudRootRoute, MenuViewController as MenuViewControllerContract } from '../types';

export class MenuViewController implements MenuViewControllerContract {
	private selectedIndex: number = 0;

	constructor() {}

	setInitialIndex(index: number): void {
		this.selectedIndex = Math.max(0, index);
	}

	setSelectedIndex(index: number): void {
		this.selectedIndex = Math.max(0, index);
	}

	buildLayout() {
		return buildMenuLayout(this.selectedIndex);
	}

	buildContent(_activeRoute: HudRootRoute) {
		return buildMenuContents(this.selectedIndex, _activeRoute);
	}

	async handleEvent(event: EvenHubEvent): Promise<HudIntent[]> {
		const type = event.listEvent?.eventType ?? event.textEvent?.eventType ?? event.sysEvent?.eventType;

		if (type === OsEventTypeList.SCROLL_BOTTOM_EVENT || type === OsEventTypeList.SCROLL_TOP_EVENT) {
			const dir = type === OsEventTypeList.SCROLL_BOTTOM_EVENT ? 1 : -1;
			const index = (this.selectedIndex + dir + MENU_ITEMS.length) % MENU_ITEMS.length;
			return [{ type: 'menuScroll', index }];
		}

		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) return [{ type: 'closeMenu' }];

		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) {
			const view = getMenuViewByIndex(this.selectedIndex);
			if (view === 'home') return [{ type: 'goHome' }];
			if (view === 'stats') return [{ type: 'goStats' }];
			if (view === 'history') return [{ type: 'goHistory' }];
			return [{ type: 'goHome' }];
		}

		return [];
	}

	getUpgradeableContainers(): string[] {
		return [];
	}
}
