import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import type { HudHistoryDaySummary, HudSnapshot } from '../domain/types';
import { getMenuIndexForView } from './screens/menu-screen';
import { StatusScreen } from './screens/status-screen';
import { RootShellScreen } from './screens/root-shell';
import type { HudActions, HudHomeVisualState, HudIntent, HudRenderState, HudRoute, HudScreenRenderContext, HudTransientStatus, HudUiState } from './types';
import { HistoryViewController } from './view-controllers/history-view-controller';
import { HomeViewController } from './view-controllers/home-view-controller';
import { MenuViewController } from './view-controllers/menu-view-controller';
import { StatsViewController } from './view-controllers/stats-view-controller';

const defaultSnapshot: HudSnapshot = {
	phase: 'booting',
	statusMessage: null,
	home: {
		todayCount: 0,
		lastSmokeAt: null,
		dailyTarget: null,
		weightedAverage: 0,
	},
	stats: {
		week: { period: 'week', totalSmoked: 0, comparisonLabel: '0%', weightedAverage: 0, averageIntervalLabel: '--:--:--', series: [] },
		month: { period: 'month', totalSmoked: 0, comparisonLabel: '0%', weightedAverage: 0, averageIntervalLabel: '--:--:--', series: [] },
		year: { period: 'year', totalSmoked: 0, comparisonLabel: '0%', weightedAverage: 0, averageIntervalLabel: '--:--:--', series: [] },
	},
	history: {
		days: [],
		hasMore: false,
		loading: false,
	},
	pendingAction: null,
};

const defaultUi: HudUiState = {
	route: 'home',
	statsPeriod: 'week',
	historySelectedDayKey: null,
};

export class HudController {
	private readonly shell = new RootShellScreen();
	private readonly statusScreen = new StatusScreen();
	private readonly onChange: () => void;
	private readonly onNavigate: (intent: HudIntent) => void;
	private actions: HudActions;
	private snapshot: HudSnapshot = defaultSnapshot;
	private ui: HudUiState = defaultUi;
	private route: HudRoute = 'home';
	private menuOpenedAt = 0;
	private readonly MENU_ENTRY_COOLDOWN_MS = 400;
	private homeVisualState: HudHomeVisualState = { mode: 'idle', message: null, loggedAt: null, todayCount: null };
	private homeVisualTimer: ReturnType<typeof setTimeout> | null = null;
	private smokePending = false;

	private readonly homeController = new HomeViewController(this.shell);
	private readonly statsController = new StatsViewController(this.shell);
	private readonly historyController = new HistoryViewController(this.shell);
	private readonly menuController = new MenuViewController();

	constructor(actions: HudActions, ui: HudUiState, onNavigate: (intent: HudIntent) => void, onChange: () => void) {
		this.actions = actions;
		this.ui = ui;
		this.route = ui.route;
		this.onNavigate = onNavigate;
		this.onChange = onChange;
	}

	updateActions(actions: HudActions): void {
		this.actions = actions;
	}

	updateUi(ui: HudUiState): void {
		const prevRoute = this.route;
		this.ui = ui;
		if (this.route !== 'menu') {
			this.route = ui.route;
		}
		if (this.route !== prevRoute) {
			console.log(`[HUD-CTRL] updateUi changed route ${prevRoute} -> ${this.route} (ui.route=${ui.route})`);
		}
	}

	updateSnapshot(snapshot: HudSnapshot): void {
		this.snapshot = snapshot;
	}

	dispose(): void {
		if (this.homeVisualTimer) clearTimeout(this.homeVisualTimer);
	}

	getCurrentRoute(): HudRoute {
		if (this.snapshot.phase !== 'ready') return 'status';
		return this.route;
	}

	shouldRunHomeTimer(): boolean {
		return this.snapshot.phase === 'ready' && this.route === 'home';
	}

	getCurrentHeaderClock(now = new Date()): string {
		return this.shell.buildHeader(now).slice(0, 5);
	}

	buildRenderState(now = new Date()): HudRenderState {
		console.log(`[HUD-CTRL] buildRenderState  route=${this.route}  phase=${this.snapshot.phase}`);
		if (this.snapshot.phase !== 'ready') {
			return this.statusScreen.build(this.buildPhaseStatus());
		}

		const context: HudScreenRenderContext = { now, snapshot: this.snapshot, ui: this.ui };
		if (this.route === 'menu') {
			return {
				layout: this.menuController.buildLayout(),
				textContents: this.menuController.buildContent(this.ui.route),
			};
		}

		if (this.route === 'home') {
			return {
				layout: this.homeController.buildLayout(),
				textContents: this.homeController.buildContent(context, this.homeVisualState),
			};
		}

		if (this.route === 'stats') {
			return {
				layout: this.statsController.buildLayout(),
				textContents: this.statsController.buildContent(context),
			};
		}

		return {
			layout: this.historyController.buildLayout(),
			textContents: this.historyController.buildContent(context, this.getSelectedHistoryDay()),
		};
	}

	async handleEvent(event: EvenHubEvent): Promise<void> {
		const eventType = event.textEvent?.eventType ?? event.sysEvent?.eventType ?? event.listEvent?.eventType;
		console.log(`[HUD-CTRL] handleEvent  route=${this.route}  eventType=${eventType}  listIndex=${event.listEvent?.currentSelectItemIndex}`);
		if (this.snapshot.phase !== 'ready') return;

		if (this.route === 'menu') {
			const elapsed = Date.now() - this.menuOpenedAt;
			console.log(`[HUD-CTRL] menu event  elapsed=${elapsed}ms  cooldown=${this.MENU_ENTRY_COOLDOWN_MS}ms`);
			// Drop events arriving within the cooldown window after menu opened.
			// The G2 firmware emits a phantom CLICK right after a DOUBLE_CLICK, which
			// would otherwise be processed as a menu commit (goHome at index 0).
			if (elapsed >= this.MENU_ENTRY_COOLDOWN_MS) {
				await this.applyIntents(await this.menuController.handleEvent(event));
			} else {
				console.log(`[HUD-CTRL] menu event DROPPED (within cooldown)`);
			}
			return;
		}

		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType ?? event.listEvent?.eventType;

		if (this.route === 'home') {
			// DOUBLE_CLICK always opens the menu — must be checked first to avoid
			// the phantom CLICK that firmware emits after a double-tap being
			// mis-routed to triggerLogSmoke.
			if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) {
				await this.applyIntents([{ type: 'openMenu' }]);
				return;
			}
			if (type === OsEventTypeList.CLICK_EVENT || type === undefined) {
				await this.triggerLogSmoke();
				return;
			}
			await this.applyIntents(await this.homeController.handleEvent(event, { now: new Date(), snapshot: this.snapshot, ui: this.ui }));
			return;
		}

		if (this.route === 'stats') {
			await this.applyIntents(await this.statsController.handleEvent(event, { now: new Date(), snapshot: this.snapshot, ui: this.ui }));
			return;
		}

		await this.applyIntents(await this.historyController.handleEvent(event, { now: new Date(), snapshot: this.snapshot, ui: this.ui }, this.getSelectedHistoryDay()));
	}

	private async applyIntents(intents: HudIntent[]): Promise<void> {
		for (const intent of intents) {
			console.log(`[HUD-CTRL] applyIntent  type=${intent.type}  currentRoute=${this.route}`);
			switch (intent.type) {
				case 'openMenu': {
					// Pre-seed the selected index to match the current active route
					// so opening from stats pre-highlights "Stats", etc.
					const routeForIndex = this.ui.route === 'history' ? 'history-list' : this.ui.route;
					this.menuController.setInitialIndex(getMenuIndexForView(routeForIndex));
					this.route = 'menu';
					this.menuOpenedAt = Date.now();
					console.log(`[HUD-CTRL] route -> menu  initialIndex=${getMenuIndexForView(routeForIndex)}`);
					this.onChange();
					break;
				}
				case 'closeMenu':
					this.route = this.ui.route;
					this.onChange();
					break;
				case 'goHome':
					this.route = 'home';
					this.onNavigate(intent);
					this.onChange();
					break;
				case 'goStats':
					this.route = 'stats';
					this.onNavigate(intent);
					this.onChange();
					break;
				case 'goHistory':
					this.route = 'history';
					this.onNavigate(intent);
					this.onChange();
					break;
				case 'menuScroll':
					this.menuController.setSelectedIndex(intent.index);
					this.onChange();
					break;
				case 'cycleStatsPeriod':
				case 'historyPrevDay':
				case 'historyNextDay':
				case 'historyResetToday':
					this.onNavigate(intent);
					this.onChange();
					break;
			}
		}
	}

	private async triggerLogSmoke(): Promise<void> {
		if (this.smokePending) return;
		this.smokePending = true;
		try {
			this.setHomeVisualState({ mode: 'logging', message: null, loggedAt: null, todayCount: null });
			const result = await this.actions.logSmoke();
			if (!result.ok) {
				this.setHomeVisualState({ mode: 'error', message: result.errorMessage ?? 'Could not log smoke.', loggedAt: null, todayCount: null }, 1700);
				return;
			}
			this.setHomeVisualState(
				{
					mode: 'success',
					message: null,
					loggedAt: result.loggedAt ?? new Date(),
					todayCount: result.todayCount ?? this.snapshot.home.todayCount,
				},
				1500,
			);
		} finally {
			this.smokePending = false;
		}
	}

	private setHomeVisualState(state: HudHomeVisualState, clearAfterMs?: number): void {
		if (this.homeVisualTimer) clearTimeout(this.homeVisualTimer);
		this.homeVisualState = state;
		this.onChange();
		if (!clearAfterMs) return;
		this.homeVisualTimer = setTimeout(() => {
			this.homeVisualTimer = null;
			this.homeVisualState = { mode: 'idle', message: null, loggedAt: null, todayCount: null };
			this.onChange();
		}, clearAfterMs);
	}

	private buildPhaseStatus(): HudTransientStatus {
		if (this.snapshot.phase === 'blocked') return { tone: 'error', title: 'Smokeless', body: [this.snapshot.statusMessage ?? 'Please restart the app on your phone.'] };
		if (this.snapshot.phase === 'onboarding') return { tone: 'neutral', title: 'Onboarding', body: [this.snapshot.statusMessage ?? 'Continue setup on your phone to unlock the HUD.'] };
		return { tone: 'neutral', title: 'Smokeless', body: [this.snapshot.statusMessage ?? 'Connecting to Even and syncing your smoking history.'] };
	}

	private getSelectedHistoryDay(): HudHistoryDaySummary | null {
		if (this.snapshot.history.days.length === 0) return null;
		const selected = this.ui.historySelectedDayKey ? this.snapshot.history.days.find((day) => day.dayKey === this.ui.historySelectedDayKey) : null;
		return selected ?? this.snapshot.history.days[0] ?? null;
	}

}
