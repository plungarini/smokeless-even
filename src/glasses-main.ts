/**
 * Pure-TypeScript entry point for the glasses/HUD layer.
 *
 * Runs in parallel with `main.tsx` (the React web UI). Both scripts are
 * loaded by `index.html`; they communicate only through the shared
 * `appStore` singleton. Neither imports the other.
 */

import { waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { startBootstrap } from './app/bootstrap';
import { appStore } from './app/store';
import type { AppState } from './app/store';
import { initEventDispatcher } from './glasses/events';
import { initRenderLoop, scheduleRender } from './glasses/render-loop';
import { Router, type ViewKey } from './glasses/router';
import { HudSession } from './glasses/session';
import { HistoryView } from './glasses/screens/history/history-view';
import { HomeView } from './glasses/screens/home/home-view';
import { MenuView } from './glasses/screens/menu/menu-view';
import { StatsView } from './glasses/screens/stats/stats-view';
import type { AppTab } from './features/smokeless/ui/types';

const TAB_TO_VIEW: Partial<Record<AppTab, ViewKey>> = {
	home: 'home',
	stats: 'stats',
	history: 'history',
};

async function main(): Promise<void> {
	// Fire bootstrap (idempotent; React also calls this).
	void startBootstrap();

	let bridge;
	try {
		bridge = await waitForEvenAppBridge();
	} catch (error) {
		console.error('[GlassesMain] bridge unavailable', error);
		return;
	}

	const session = new HudSession(bridge);

	const homeView = new HomeView();
	const statsView = new StatsView();
	const historyView = new HistoryView();
	const menuView = new MenuView(bridge);

	const initialKey = TAB_TO_VIEW[appStore.getState().tab] ?? 'home';
	const router = new Router(
		{
			home: homeView,
			stats: statsView,
			history: historyView,
			menu: menuView,
		},
		initialKey,
	);

	// Give each view access to the router so they can push/pop/reset directly.
	homeView.setRouter(router);
	statsView.setRouter(router);
	historyView.setRouter(router);
	menuView.setRouter(router);

	initRenderLoop(session, router);
	initEventDispatcher(bridge, router);

	// ── Store→router tab sync ────────────────────────────────────────
	// When the web UI changes tab (or the store navigation actions fire),
	// move the router to match. Menu is an overlay — don't touch it unless
	// the tab actually differs AND menu is open AND the user has clearly
	// navigated elsewhere (the menu's own handler uses `router.reset` so
	// that path is already covered).
	let lastTab: AppState['tab'] = appStore.getState().tab;
	appStore.subscribe(() => {
		const state = appStore.getState();
		if (state.tab !== lastTab) {
			lastTab = state.tab;
			const target = TAB_TO_VIEW[state.tab];
			if (target && router.currentKey !== 'menu' && router.currentKey !== target) {
				router.reset(target);
			}
		}
		scheduleRender();
	});

	router.subscribe(scheduleRender);
	scheduleRender();
}

void main().catch((error) => {
	console.error('[GlassesMain] fatal', error);
});
