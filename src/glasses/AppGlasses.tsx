import {
	CreateStartUpPageContainer,
	type EvenHubEvent,
	OsEventTypeList,
	RebuildPageContainer,
	StartUpPageCreateResult,
	TextContainerProperty,
	waitForEvenAppBridge,
} from '@evenrealities/even_hub_sdk';
import { useEffect, useEffectEvent, useRef } from 'react';
import type { HudSnapshot } from '../domain/types';
import { buildHudText, type HudMode } from './shared';

type Bridge = Awaited<ReturnType<typeof waitForEvenAppBridge>>;

interface Props {
	snapshot: HudSnapshot;
	onConfirmSmoke: () => Promise<boolean>;
}

export function AppGlasses({ snapshot, onConfirmSmoke }: Props) {
	const bridgeRef = useRef<Bridge | null>(null);
	const pageCreatedRef = useRef(false);
	const modeRef = useRef<HudMode>('glance');
	const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const summaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const snapshotRef = useRef(snapshot);
	const renderLockRef = useRef({ active: false, queued: false });

	const clearTimers = useEffectEvent(() => {
		if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
		if (summaryTimerRef.current) clearTimeout(summaryTimerRef.current);
		confirmTimerRef.current = null;
		summaryTimerRef.current = null;
	});

	const renderHud = useEffectEvent(async () => {
		const bridge = bridgeRef.current;
		if (!bridge) return;

		const content = buildHudText(modeRef.current, snapshotRef.current);
		const params = {
			containerTotalNum: 1,
			textObject: [
				new TextContainerProperty({
					xPosition: 0,
					yPosition: 84,
					width: 576,
					height: 120,
					borderWidth: 0,
					paddingLength: 8,
					containerID: 1,
					containerName: 'smokeless-hud',
					isEventCapture: snapshotRef.current.blockedMessage ? 0 : 1,
					content,
				}),
			],
		};

		if (!pageCreatedRef.current) {
			const created = await bridge.createStartUpPageContainer(new CreateStartUpPageContainer(params));
			if (created === StartUpPageCreateResult.success) {
				pageCreatedRef.current = true;
				return;
			}
		}

		await bridge.rebuildPageContainer(new RebuildPageContainer(params));
		pageCreatedRef.current = true;
	});

	const scheduleRender = useEffectEvent(() => {
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
	});

	const enterMode = useEffectEvent((mode: HudMode) => {
		clearTimers();
		modeRef.current = mode;

		if (mode === 'confirm') {
			confirmTimerRef.current = setTimeout(() => {
				modeRef.current = 'glance';
				scheduleRender();
			}, 5000);
		}

		if (mode === 'summary') {
			summaryTimerRef.current = setTimeout(() => {
				modeRef.current = 'glance';
				scheduleRender();
			}, 8000);
		}

		scheduleRender();
	});

	const handleEvent = useEffectEvent(async (event: EvenHubEvent) => {
		if (snapshotRef.current.blockedMessage) return;

		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType;

		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) {
			if (modeRef.current === 'confirm') {
				const ok = await onConfirmSmoke();
				enterMode('glance');
				if (!ok) {
					scheduleRender();
				}
				return;
			}

			enterMode('confirm');
			return;
		}

		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) {
			if (modeRef.current === 'confirm') {
				enterMode('glance');
				return;
			}

			enterMode(modeRef.current === 'summary' ? 'glance' : 'summary');
		}
	});

	useEffect(() => {
		snapshotRef.current = snapshot;
		scheduleRender();
	}, [snapshot, scheduleRender]);

	useEffect(() => {
		let cancelled = false;

		void (async () => {
			try {
				const bridge = await waitForEvenAppBridge();
				if (cancelled) return;
				bridgeRef.current = bridge;
				bridge.onEvenHubEvent((event) => {
					void handleEvent(event);
				});
				scheduleRender();
			} catch (error) {
				console.error('[Smokeless HUD] bridge unavailable', error);
			}
		})();

		return () => {
			cancelled = true;
			clearTimers();
		};
	}, [clearTimers, handleEvent, scheduleRender]);

	return null;
}
