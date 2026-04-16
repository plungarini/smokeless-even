import { FieldValue } from 'firebase-admin/firestore';
import type { SmokeLogEntry } from '../domain/types';
import { startOfDay } from '../lib/time';
import { userRef } from '../repositories/refs';

export function computeLongestCessation(entries: SmokeLogEntry[], now = new Date()): number | null {
	if (entries.length === 0) return null;

	const sorted = [...entries].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
	let longestGapMs = Math.max(0, now.getTime() - sorted[sorted.length - 1]!.timestamp.getTime());

	for (let index = 1; index < sorted.length; index += 1) {
		const gapMs = sorted[index]!.timestamp.getTime() - sorted[index - 1]!.timestamp.getTime();
		if (gapMs > longestGapMs) {
			longestGapMs = gapMs;
		}
	}

	return longestGapMs;
}

export function buildTodayMaxCessation(entries: SmokeLogEntry[], now = new Date()): { value: number; lastUpdated: Date } | null {
	const dayStart = startOfDay(now);
	const sorted = [...entries].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
	let maxSeconds = 0;
	let previousTimestamp: Date | null = null;

	for (const entry of sorted) {
		if (entry.timestamp < dayStart) {
			previousTimestamp = entry.timestamp;
			continue;
		}

		const intervalStart = previousTimestamp && previousTimestamp > dayStart ? previousTimestamp : dayStart;
		const gapSeconds = Math.max(0, Math.round((entry.timestamp.getTime() - intervalStart.getTime()) / 1000));
		maxSeconds = Math.max(maxSeconds, gapSeconds);
		previousTimestamp = entry.timestamp;
	}

	const tailStart = previousTimestamp && previousTimestamp > dayStart ? previousTimestamp : dayStart;
	maxSeconds = Math.max(maxSeconds, Math.max(0, Math.round((now.getTime() - tailStart.getTime()) / 1000)));

	return {
		value: maxSeconds,
		lastUpdated: now,
	};
}

export async function updateUserMetrics(uid: string, entries: SmokeLogEntry[]): Promise<void> {
	const now = new Date();
	const longest = computeLongestCessation(entries, now);
	const todayMax = buildTodayMaxCessation(entries, now);
	await userRef(uid).set(
		{
			longestEverCessation: Math.round((longest ?? 0) / 1000),
			todayMaxCessation: todayMax
				? {
					value: todayMax.value,
					lastUpdated: todayMax.lastUpdated,
				}
				: null,
			updatedAt: FieldValue.serverTimestamp(),
		},
		{ merge: true },
	);
}
