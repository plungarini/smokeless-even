/**
 * Module-scoped 1-second clock used only by components that render a live
 * timer. Other components subscribe to AppStore directly, which updates on
 * data changes (not every tick). A single interval for the whole app avoids
 * every component re-rendering per second.
 */

type Listener = (nowMs: number) => void;

let nowMs: number = Date.now();
let intervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<Listener>();

function ensureInterval(): void {
	if (intervalId !== null) return;
	intervalId = setInterval(() => {
		nowMs = Date.now();
		for (const listener of listeners) {
			try {
				listener(nowMs);
			} catch (error) {
				console.error('[clock] listener error', error);
			}
		}
	}, 1_000);
}

function stopIntervalIfIdle(): void {
	if (intervalId !== null && listeners.size === 0) {
		clearInterval(intervalId);
		intervalId = null;
	}
}

export function subscribeClock(listener: Listener): () => void {
	listeners.add(listener);
	ensureInterval();
	return () => {
		listeners.delete(listener);
		stopIntervalIfIdle();
	};
}

export function getNowMs(): number {
	return nowMs;
}
