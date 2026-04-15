import { waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { useEffect, useRef, useCallback } from 'react';
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

	// ── Props sync: push new props into the already-existing controller ──
	useEffect(() => {
		controllerRef.current?.updateActions(actions);
		controllerRef.current?.updateSnapshot(snapshot);
		controllerRef.current?.updateUi(ui);
		scheduleRender();
	}, [actions, snapshot, ui, scheduleRender]);

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
					void controller.handleEvent(event);
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
