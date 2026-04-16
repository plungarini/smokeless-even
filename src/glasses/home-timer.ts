import { scheduleRender } from './render-loop';

let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Start the 1-second render tick. Safe to call repeatedly — a no-op if the
 * timer is already running. Only HomeView should invoke this, from its
 * `enter()` lifecycle.
 */
export function startHomeTimer(): void {
	if (intervalId !== null) return;
	intervalId = setInterval(() => {
		scheduleRender();
	}, 1_000);
}

export function stopHomeTimer(): void {
	if (intervalId === null) return;
	clearInterval(intervalId);
	intervalId = null;
}
