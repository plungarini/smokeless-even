import type { HudSnapshot } from '../domain/types';
import { formatHudLastSmoke } from '../lib/time';

export type HudMode = 'glance' | 'confirm' | 'summary';

export function buildHudText(mode: HudMode, snapshot: HudSnapshot, now = new Date()): string {
	if (snapshot.blockedMessage) {
		return `Unable to connect to your Even account.\nPlease restart the app.`;
	}

	if (mode === 'confirm') {
		return `Log smoke?\n[click to confirm]`;
	}

	if (mode === 'summary') {
		const target = snapshot.dailyTarget ?? '-';
		const state = snapshot.dailyTarget !== null && snapshot.todayCount > snapshot.dailyTarget ? 'OVER' : 'OK';
		return `Today: ${snapshot.todayCount}  Target: ${target}  ${state}\nAvg: ${snapshot.weightedAverage.toFixed(1)}/day  Weighted`;
	}

	return `Smokes: ${snapshot.todayCount}  |  Last: ${formatHudLastSmoke(snapshot.lastSmokeAt, now)}`;
}
