import type { HudSnapshot } from '../domain/types';

type Listener = (snapshot: HudSnapshot) => void;

const listeners = new Set<Listener>();

let snapshot: HudSnapshot = {
	todayCount: 0,
	lastSmokeAt: null,
	dailyTarget: null,
	weightedAverage: 0,
	blockedMessage: null,
};

export function getHudSnapshot(): HudSnapshot {
	return snapshot;
}

export function setHudSnapshot(next: HudSnapshot): void {
	snapshot = next;
	listeners.forEach((listener) => listener(snapshot));
}

export function subscribeHudSnapshot(listener: Listener): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
