import { waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { HudSnapshot } from '../domain/types';
import { HudController } from './controller';
import { HudSession } from './session';
import type { HudActions, HudIntent, HudUiState } from './types';

interface Props {
	snapshot: HudSnapshot;
	actions: HudActions;
	ui: HudUiState;
	onNavigate: (intent: HudIntent) => void;
}

export function AppGlasses({ snapshot, actions, ui, onNavigate }: Props) {
	const controllerRef = useRef<HudController | null>(null);
	const sessionRef = useRef<HudSession | null>(null);
	const renderLockRef = useRef({ active: false, queued: false });
	const minuteClockRef = useRef('');
	const lastAppliedSyncKeyRef = useRef<string | null>(null);
	const lastActionsRef = useRef<HudActions | null>(null);

	// Keep latest props in refs so the bridge effect (mount-once) always
	// has access to current values without needing to re-run.
	const latestProps = useRef({ snapshot, actions, ui, onNavigate });
	latestProps.current = { snapshot, actions, ui, onNavigate };

	const renderHud = useCallback(async () => {
		const controller = controllerRef.current;
		const session = sessionRef.current;
		if (!controller || !session) return;
		await session.render(controller.buildRenderState());
	}, []);

	const scheduleRender = useCallback(() => {
		if (renderLockRef.current.active) {
			renderLockRef.current.queued = true;
			return;
		}

		renderLockRef.current.active = true;
		void renderHud()
			.catch((error) => {
				console.error('[Smokeless HUD] render failed', error);
			})
			.finally(() => {
				renderLockRef.current.active = false;
				if (renderLockRef.current.queued) {
					renderLockRef.current.queued = false;
					scheduleRender();
				}
			});
	}, [renderHud]);

	const syncKey = getHudSyncKey(snapshot, ui);

	// ── Props sync: push new props into the already-existing controller ──
	useLayoutEffect(() => {
		const controller = controllerRef.current;
		if (!controller) return;

		if (lastActionsRef.current !== actions) {
			controller.updateActions(actions);
			lastActionsRef.current = actions;
		}

		if (lastAppliedSyncKeyRef.current === syncKey) {
			return;
		}

		controller.updateSnapshot(snapshot);
		controller.updateUi(ui);
		lastAppliedSyncKeyRef.current = syncKey;
		if (ui.route === 'history') {
			console.log(`[HUD-HISTORY] AppGlasses props sync dayKey=${ui.historySelectedDayKey}`);
		}
		scheduleRender();
	}, [actions, snapshot, ui, scheduleRender, syncKey]);

	// ── 1-second timer for home-screen clock + smoke timer ──
	useEffect(() => {
		const tick = () => {
			const controller = controllerRef.current;
			if (!controller) return;
			const nextMinute = controller.getCurrentHeaderClock(new Date());
			if (minuteClockRef.current !== nextMinute) {
				minuteClockRef.current = nextMinute;
				scheduleRender();
				return;
			}
			if (controller.shouldRunHomeTimer()) {
				scheduleRender();
			}
		};

		tick();
		const timer = setInterval(tick, 1000);
		return () => clearInterval(timer);
	}, [scheduleRender]);

	// ── Bridge init: runs ONCE per component lifetime ──
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		console.log(`[HUD-GLASSES] MOUNT — creating controller + bridge`);
		const controller = new HudController(
			latestProps.current.actions,
			latestProps.current.ui,
			(intent) => latestProps.current.onNavigate(intent),
			scheduleRender,
		);
		controllerRef.current = controller;
		controller.updateSnapshot(latestProps.current.snapshot);
		minuteClockRef.current = controller.getCurrentHeaderClock(new Date());

		let cancelled = false;

		void (async () => {
			try {
				const bridge = await waitForEvenAppBridge();
				if (cancelled) return;
				console.log(`[HUD-GLASSES] bridge obtained, creating session`);
				sessionRef.current = new HudSession(bridge);
				bridge.onEvenHubEvent((event) => {
					// Guard: ignore events after this component instance is unmounted.
					// Since the SDK has no unsubscribe mechanism, stale listeners remain
					// on the bridge. This flag prevents them from doing anything.
					if (cancelled) return;
					controller.handleEvent(event).catch((error) => {
						console.error('[Smokeless HUD] event handler failed', error);
					});
				});
				scheduleRender();
			} catch (error) {
				console.error('[Smokeless HUD] bridge unavailable', error);
			}
		})();

		return () => {
			console.log(`[HUD-GLASSES] UNMOUNT — disposing controller + session`);
			cancelled = true;
			controller.dispose();
			controllerRef.current = null;
			sessionRef.current = null;
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally mount-once

	return null;
}

function getHudSyncKey(snapshot: HudSnapshot, ui: HudUiState): string {
	if (snapshot.phase !== 'ready') {
		return `phase:${snapshot.phase}:${snapshot.statusMessage ?? ''}`;
	}

	if (ui.route === 'home') {
		return [
			'home',
			snapshot.phase,
			snapshot.home.todayCount,
			snapshot.home.lastSmokeAt?.getTime() ?? 'none',
			snapshot.home.dailyTarget ?? 'none',
			snapshot.pendingAction ?? 'none',
		].join('|');
	}

	if (ui.route === 'stats') {
		const stats = snapshot.stats[ui.statsPeriod];
		return [
			'stats',
			ui.statsPeriod,
			stats.totalSmoked,
			stats.comparisonLabel,
			stats.weightedAverage,
			stats.averageIntervalLabel,
			stats.series.map((item) => `${item.label}:${item.count}`).join(','),
		].join('|');
	}

	const selectedDay = ui.historySelectedDayKey
		? (snapshot.history.days.find((day) => day.dayKey === ui.historySelectedDayKey) ?? null)
		: null;

	return [
		'history',
		ui.historySelectedDayKey ?? 'today',
		selectedDay?.count ?? 0,
		selectedDay?.entries.map((entry) => entry.timestamp.getTime()).join(',') ?? '',
	].join('|');
}
