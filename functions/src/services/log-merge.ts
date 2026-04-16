import type { SmokeLogEntry } from '../domain/types';

export function dedupeLogs(entries: SmokeLogEntry[]): SmokeLogEntry[] {
	const byTimestamp = new Map<string, SmokeLogEntry>();
	for (const entry of entries) {
		const key = entry.timestamp.toISOString();
		if (!byTimestamp.has(key)) {
			byTimestamp.set(key, entry);
		}
	}
	return [...byTimestamp.values()].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
}

export function rebuildIntervals(entries: SmokeLogEntry[]): SmokeLogEntry[] {
	const sorted = [...entries].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
	return sorted.map((entry, index) => {
		const previous = sorted[index - 1];
		return {
			id: entry.id,
			timestamp: entry.timestamp,
			intervalSincePrevious: previous ? Math.max(0, Math.round((entry.timestamp.getTime() - previous.timestamp.getTime()) / 1000)) : null,
		};
	});
}
