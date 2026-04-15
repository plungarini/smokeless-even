import type { HudLayoutDescriptor } from '../types';
import { HUD_WIDTH } from '../constants';

export const MENU_ITEMS: Array<{ view: string; label: string; description: string }> = [
	{ view: 'home', label: 'Home', description: 'Quick add' },
	{ view: 'stats', label: 'Stats', description: 'Trend and averages' },
	{ view: 'history-list', label: 'History', description: 'Browse days' },
];

export function buildMenuLayout(selectedIndex: number): HudLayoutDescriptor {
	return {
		key: `menu-${selectedIndex}`,
		textDescriptors: [
			{
				containerID: 1,
				containerName: 'menu-header',
				xPosition: 46,
				yPosition: 8,
				width: HUD_WIDTH - 92,
				height: 28,
				paddingLength: 4,
			},
			...MENU_ITEMS.map((_item, index) => {
				const isSelected = index === selectedIndex;
				return {
					containerID: 2 + index,
					containerName: `menu-item-${index}`,
					xPosition: 60,
					yPosition: 46 + index * 56,
					width: HUD_WIDTH - 120,
					height: 48,
					paddingLength: 8,
					borderWidth: isSelected ? 2 : 0,
					borderRadius: 8,
					isEventCapture: isSelected ? 1 : 0,
				};
			})
		],
		listObject: undefined,
	};
}

export function buildMenuContents(_selectedIndex: number): Record<string, string> {
	const contents: Record<string, string> = {
		'menu-header': ' Smokeless menu',
	};
	MENU_ITEMS.forEach((item, index) => {
		contents[`menu-item-${index}`] = `${item.label}  —  ${item.description}`;
	});
	return contents;
}

export function getMenuViewByIndex(index: number): 'home' | 'stats' | 'history-list' {
	const view = MENU_ITEMS[Math.min(Math.max(index, 0), MENU_ITEMS.length - 1)]?.view;
	if (view === 'stats') return 'stats';
	if (view === 'history-list') return 'history-list';
	return 'home';
}

export function getMenuIndexForView(view: string): number {
	const idx = MENU_ITEMS.findIndex((item) => item.view === view);
	return Math.max(0, idx);
}
