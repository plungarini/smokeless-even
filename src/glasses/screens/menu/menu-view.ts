import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import { appStore } from '../../../app/store';
import { HUD_HEIGHT } from '../../constants';
import { scheduleRender } from '../../render-loop';
import type { Router, View, ViewKey } from '../../router';
import type { HudLayoutDescriptor } from '../../types';

interface MenuEntry {
	view: ViewKey;
	tab: 'home' | 'stats' | 'history';
	label: string;
	description: string;
}

const MENU_ITEMS: MenuEntry[] = [
	{ view: 'home', tab: 'home', label: 'Home', description: 'Quick add' },
	{ view: 'stats', tab: 'stats', label: 'Stats', description: 'Trend and averages' },
	{ view: 'history', tab: 'history', label: 'History', description: 'Browse days' },
];

const ITEM_Y_START = 46;
const ITEM_STEP = 56;
const ITEM_H = 48;

function buildMenuLayout(selectedIndex: number): HudLayoutDescriptor {
	return {
		// Key includes selection so the border/padding swap triggers a rebuild.
		key: `menu-${selectedIndex}`,
		textDescriptors: [
			{
				containerID: 0,
				containerName: 'events',
				xPosition: 0,
				yPosition: 0,
				width: 0,
				height: HUD_HEIGHT,
				isEventCapture: 1,
			},
			{
				containerID: 1,
				containerName: 'header',
				xPosition: 67,
				yPosition: 8,
				width: 445,
				height: 43,
				paddingLength: 4,
			},
			...MENU_ITEMS.map((_item, index) => {
				const isSelected = index === selectedIndex;
				return {
					containerID: 2 + index,
					containerName: `item-${index}`,
					xPosition: 80,
					yPosition: ITEM_Y_START + index * ITEM_STEP,
					width: 415,
					height: ITEM_H,
					paddingLength: isSelected ? 8 : 9,
					borderWidth: isSelected ? 1 : 0,
					borderColor: isSelected ? 13 : 0,
					borderRadius: 8,
					isEventCapture: 0,
				};
			}),
		],
	};
}

function buildMenuContents(selectedIndex: number, activeTab: string): Record<string, string> {
	const contents: Record<string, string> = {
		header: '╭───────  Smokeless  ───────╮',
	};
	for (let i = 0; i < MENU_ITEMS.length; i++) {
		const item = MENU_ITEMS[i]!;
		// ">" marks the page the user is currently on — independent of the
		// scroll cursor (border). Both can be on different items at once.
		const activeIndicator = item.tab === activeTab ? '>  ' : '    ';
		contents[`item-${i}`] = `  ${activeIndicator}${item.label}  •  ${item.description}`;
	}
	return contents;
}

function tabToIndex(tab: string): number {
	const idx = MENU_ITEMS.findIndex((item) => item.tab === tab);
	return Math.max(0, idx);
}

export class MenuView implements View {
	readonly key: ViewKey = 'menu';
	private router: Router | null = null;
	private selectedIndex = 0;

	setRouter(router: Router): void {
		this.router = router;
	}

	enter(): void {
		// Seed selection to whatever tab is currently active so the user
		// always opens the menu with their current page highlighted.
		this.selectedIndex = tabToIndex(appStore.getState().tab);
	}

	layout(): HudLayoutDescriptor {
		return buildMenuLayout(this.selectedIndex);
	}

	contents(): Record<string, string> {
		return buildMenuContents(this.selectedIndex, appStore.getState().tab);
	}

	handleEvent(event: EvenHubEvent): void {
		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType ?? event.listEvent?.eventType;

		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) {
			this.router?.pop();
			return;
		}
		if (type === OsEventTypeList.SCROLL_TOP_EVENT) {
			this.selectedIndex = (this.selectedIndex - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
			scheduleRender();
			return;
		}
		if (type === OsEventTypeList.SCROLL_BOTTOM_EVENT) {
			this.selectedIndex = (this.selectedIndex + 1) % MENU_ITEMS.length;
			scheduleRender();
			return;
		}
		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) {
			const entry = MENU_ITEMS[this.selectedIndex]!;
			appStore.setTab(entry.tab);
			this.router?.reset(entry.view);
		}
	}
}
