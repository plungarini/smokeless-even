import { OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk';
import { selectLastSmokeAt } from '../../../app/selectors';
import { appStore } from '../../../app/store';
import { startHomeTimer, stopHomeTimer } from '../../home-timer';
import { scheduleRender } from '../../render-loop';
import type { Router, View, ViewKey } from '../../router';
import type { HudLayoutDescriptor } from '../../types';
import { truncate } from '../../utils';
import { ROOT_LAYOUT, buildFooter, buildHeader } from '../shared-shell';

type VisualMode = 'idle' | 'logging' | 'success' | 'error';

interface VisualState {
	mode: VisualMode;
	message: string | null;
	todayCount: number | null;
}

const STATUS_SPACING = '\n                               ';
const BODY_SPACING = '                              ';
const VALUE_PAD = 28;

function padValue(value: string | number): string {
	return `${value}`.padStart(VALUE_PAD, ' ');
}

function formatSmokeFreeClock(lastSmokeAt: Date | null, now: Date): string {
	if (!lastSmokeAt) return '--:--:--';
	const deltaMs = Math.max(0, now.getTime() - lastSmokeAt.getTime());
	const totalSeconds = Math.floor(deltaMs / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export class HomeView implements View {
	readonly key: ViewKey = 'home';

	private router: Router | null = null;
	private visual: VisualState = { mode: 'idle', message: null, todayCount: null };
	private visualClearTimer: ReturnType<typeof setTimeout> | null = null;
	private logInFlight = false;

	setRouter(router: Router): void {
		this.router = router;
	}

	layout(): HudLayoutDescriptor {
		return ROOT_LAYOUT;
	}

	contents(): Record<string, string> {
		const state = appStore.getState();
		const now = new Date();
		const lastSmokeAt = selectLastSmokeAt(state);
		const timerLabel = formatSmokeFreeClock(lastSmokeAt, now);

		let body: string;
		const mode = this.visual.mode;
		if (mode === 'logging') {
			body = `${STATUS_SPACING}--     Logging smoke...     --\n\n${BODY_SPACING}• Today:    ${padValue('...')}\n${BODY_SPACING}• Last:${padValue('--:--:--')}`;
		} else if (mode === 'success') {
			const today = this.visual.todayCount ?? state.todayCount;
			body = `${STATUS_SPACING}--       Smoke logged       --\n\n${BODY_SPACING}• Today:    ${padValue(today)}\n${BODY_SPACING}• Last:${padValue(timerLabel)}`;
		} else if (mode === 'error') {
			const message = truncate(this.visual.message ?? 'Please try again.', 30);
			body = `${STATUS_SPACING}--   Could not log smoke    --\n\n${message}\n${BODY_SPACING}• Last:${padValue(timerLabel)}`;
		} else {
			body = `${STATUS_SPACING}--     Tap to add a Log     --\n\n${BODY_SPACING}• Today:    ${padValue(state.todayCount)}\n${BODY_SPACING}• Last:${padValue(timerLabel)}`;
		}

		return {
			header: buildHeader(now),
			body,
			footer: buildFooter('home'),
			shield: ' ',
		};
	}

	enter(): void {
		startHomeTimer();
	}

	exit(): void {
		stopHomeTimer();
	}

	handleEvent(event: EvenHubEvent): void {
		const type = event.textEvent?.eventType ?? event.sysEvent?.eventType;

		// DOUBLE_CLICK always wins — check it first so the phantom CLICK that
		// firmware emits after a double-tap doesn't mis-route to logSmoke.
		if (type === OsEventTypeList.DOUBLE_CLICK_EVENT) {
			this.router?.push('menu');
			return;
		}
		if (type === OsEventTypeList.CLICK_EVENT || type === undefined) {
			void this.triggerLogSmoke();
		}
	}

	private async triggerLogSmoke(): Promise<void> {
		if (this.logInFlight) return;
		this.logInFlight = true;
		this.setVisual({ mode: 'logging', message: null, todayCount: null });
		try {
			const result = await appStore.logSmoke();
			if (result.ok) {
				this.setVisual(
					{
						mode: 'success',
						message: null,
						todayCount: result.todayCount ?? appStore.getState().todayCount,
					},
					1500,
				);
			} else {
				this.setVisual(
					{ mode: 'error', message: result.errorMessage ?? 'Could not log smoke.', todayCount: null },
					1700,
				);
			}
		} finally {
			this.logInFlight = false;
		}
	}

	private setVisual(next: VisualState, clearAfterMs?: number): void {
		if (this.visualClearTimer) {
			clearTimeout(this.visualClearTimer);
			this.visualClearTimer = null;
		}
		this.visual = next;
		scheduleRender();
		if (!clearAfterMs) return;
		this.visualClearTimer = setTimeout(() => {
			this.visualClearTimer = null;
			this.visual = { mode: 'idle', message: null, todayCount: null };
			scheduleRender();
		}, clearAfterMs);
	}
}
