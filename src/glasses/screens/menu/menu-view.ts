import {
	ListContainerProperty,
	ListItemContainerProperty,
	OsEventTypeList,
	type EvenHubEvent,
} from '@evenrealities/even_hub_sdk';
import type { Router, View, ViewKey } from '../../router';
import type { HudLayoutDescriptor } from '../../types';
import { HUD_WIDTH } from '../../constants';
import { appStore } from '../../../app/store';

interface MenuEntry {
	view: ViewKey;
	tab: 'home' | 'stats' | 'history';
	label: string;
	description: string;
}

const MENU_ITEMS: MenuEntry[] = [
	{ view: 'home', tab: 'home', label: 'Home', description: 'Quick add' },
	{ view: 'stats', tab: 'stats', label: 'Stats', description: 'Trend and averages' },
	{ view: 'history', tab: 'history', label: 'Browse days', description: 'History' },
];

const HEADER_H = 38;
const HEADER_Y = 0;
const LIST_OFFSET = 5;
const LIST_Y = HEADER_H + LIST_OFFSET;
const LIST_H = 288 - HEADER_H - LIST_OFFSET;

const MENU_LAYOUT: HudLayoutDescriptor = {
	// Stable key — firmware highlights the list natively so scrolling
	// doesn't trigger a rebuild.
	key: 'menu',
	textDescriptors: [
		{
			containerID: 1,
			containerName: 'header',
			xPosition: 40,
			yPosition: HEADER_Y,
			width: Math.ceil('╭───────  Smokeless  ───────╮'.length * 14),
			height: HEADER_H,
			paddingLength: 5,
			isEventCapture: 0,
		},
	],
	listObject: [
		new ListContainerProperty({
			xPosition: 60,
			yPosition: LIST_Y,
			width: HUD_WIDTH - 120,
			height: LIST_H,
			borderWidth: 0,
			paddingLength: 0,
			containerID: 2,
			containerName: 'list',
			isEventCapture: 1,
			itemContainer: new ListItemContainerProperty({
				itemCount: MENU_ITEMS.length,
				itemWidth: HUD_WIDTH - 120,
				isItemSelectBorderEn: 1,
				itemName: MENU_ITEMS.map((item) => `${item.label}  •  ${item.description}`),
			}),
		}),
	],
};

export class MenuView implements View {
	readonly key: ViewKey = 'menu';
	private router: Router | null = null;

	setRouter(router: Router): void {
		this.router = router;
	}

	layout(): HudLayoutDescriptor {
		return MENU_LAYOUT;
	}

	contents(): Record<string, string> {
		return {
			header: '╭───────  Smokeless  ───────╮',
		};
	}

	handleEvent(event: EvenHubEvent): void {
		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType ?? event.listEvent?.eventType;

		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) {
			this.router?.pop();
			return;
		}
		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) {
			const index = event.listEvent?.currentSelectItemIndex ?? 0;
			const entry = MENU_ITEMS[Math.max(0, Math.min(index, MENU_ITEMS.length - 1))]!;
			appStore.setTab(entry.tab);
			this.router?.reset(entry.view);
		}
	}
}
