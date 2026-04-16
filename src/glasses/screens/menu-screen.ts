import { HUD_WIDTH } from '../constants';
import type { HudLayoutDescriptor, HudRootRoute } from '../types';

export const MENU_ITEMS: Array<{ view: string; label: string; description: string }> = [
	{ view: 'home', label: 'Home', description: 'Quick add' },
	{ view: 'stats', label: 'Stats', description: 'Trend and averages' },
	{ view: 'history', label: 'History', description: 'Browse days' },
];

export function buildMenuLayout(selectedIndex: number): HudLayoutDescriptor {
	return {
		key: `menu-${selectedIndex}`,
		textDescriptors: [
			{
				containerID: 0,
				containerName: 'menu-ghost-events',
				xPosition: 0,
				yPosition: 0,
				width: HUD_WIDTH,
				height: 288,
				paddingLength: 0,
				isEventCapture: 1,
			},
			{
				containerID: 1,
				containerName: 'menu-header',
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
					containerName: `menu-item-${index}`,
					xPosition: 80,
					yPosition: 46 + index * 56,
					width: 415,
					height: 48,
					paddingLength: isSelected ? 8 : 9,
					borderWidth: isSelected ? 1 : 0,
					borderRadius: 8,
					isEventCapture: 0,
				};
			}),
		],
		listObject: undefined,
	};
}

export function buildMenuContents(_selectedIndex: number, activeRoute: HudRootRoute): Record<string, string> {
	const contents: Record<string, string> = {
		'menu-ghost-events': '',
		'menu-header': '╭───────  Smokeless  ───────╮',
	};
	MENU_ITEMS.forEach((item, index) => {
		const selected = item.view === activeRoute;
		const selectedIndicator = selected ? '>  ' : '    ';
		contents[`menu-item-${index}`] = `  ${selectedIndicator}${item.label}  •  ${item.description}`;
	});
	return contents;
}

export function getMenuViewByIndex(index: number): 'home' | 'stats' | 'history' {
	const view = MENU_ITEMS[Math.min(Math.max(index, 0), MENU_ITEMS.length - 1)]?.view;
	if (view === 'stats') return 'stats';
	if (view === 'history') return 'history';
	return 'home';
}

export function getMenuIndexForView(view: string): number {
	const idx = MENU_ITEMS.findIndex((item) => item.view === view);
	return Math.max(0, idx);
}
