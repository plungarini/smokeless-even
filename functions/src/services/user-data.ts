import { FieldValue } from 'firebase-admin/firestore';
import type { UserDocument, UserGoogleProvider } from '../domain/types';
import { db } from '../lib/firebase';
import { logsRef, userRef } from '../repositories/refs';
import { rebuildIntervals } from './log-merge';
import { updateUserMetrics } from './user-metrics';

export function buildGoogleProvider(uid: string, email: string, displayName: string): UserGoogleProvider {
	return {
		uid,
		email,
		displayName,
		linkedAt: new Date(),
	};
}

export function mergeUserDocuments(
	target: UserDocument | null,
	source: UserDocument | null,
	targetGoogle: UserGoogleProvider,
): Omit<UserDocument, 'createdAt' | 'updatedAt'> {
	return {
		longestEverCessation: target?.longestEverCessation ?? source?.longestEverCessation ?? 0,
		todayMaxCessation: target?.todayMaxCessation ?? source?.todayMaxCessation ?? null,
		preferences: target?.preferences ?? source?.preferences ?? {},
		onboarding: target?.onboarding ?? source?.onboarding ?? null,
		providers: {
			google: targetGoogle,
			even: target?.providers.even ?? source?.providers.even ?? null,
		},
	};
}

export async function clearLogs(uid: string): Promise<void> {
	while (true) {
		const snapshot = await logsRef(uid).limit(200).get();
		if (snapshot.empty) return;

		const batch = db.batch();
		for (const docSnapshot of snapshot.docs) {
			batch.delete(docSnapshot.ref);
		}
		await batch.commit();

		if (snapshot.size < 200) return;
	}
}

export async function rewriteLogs(uid: string, entries: Array<{ id: string; timestamp: Date; intervalSincePrevious: number | null }>): Promise<void> {
	await clearLogs(uid);
	for (let index = 0; index < entries.length; index += 200) {
		const batch = db.batch();
		for (const entry of entries.slice(index, index + 200)) {
			const ref = entry.id ? logsRef(uid).doc(entry.id) : logsRef(uid).doc();
			batch.set(ref, {
				timestamp: entry.timestamp,
				intervalSincePrevious: entry.intervalSincePrevious,
			});
		}
		await batch.commit();
	}
}

export async function deleteAllUserData(uid: string): Promise<void> {
	await clearLogs(uid);
	await userRef(uid).delete().catch(() => undefined);
}

export async function applyMergedUserData(params: {
	targetUid: string;
	targetDocument: UserDocument | null;
	sourceDocument: UserDocument | null;
	mergedDocument: Omit<UserDocument, 'createdAt' | 'updatedAt'>;
	mergedLogs: Array<{ id: string; timestamp: Date; intervalSincePrevious: number | null }>;
}): Promise<void> {
	const { targetUid, targetDocument, sourceDocument, mergedDocument, mergedLogs } = params;

	await rewriteLogs(targetUid, rebuildIntervals(mergedLogs));
	await userRef(targetUid).set(
		{
			longestEverCessation: mergedDocument.longestEverCessation,
			todayMaxCessation: mergedDocument.todayMaxCessation,
			preferences: mergedDocument.preferences,
			onboarding: mergedDocument.onboarding,
			providers: mergedDocument.providers,
			createdAt: targetDocument?.createdAt ?? sourceDocument?.createdAt ?? FieldValue.serverTimestamp(),
			updatedAt: FieldValue.serverTimestamp(),
		},
		{ merge: true },
	);
	await updateUserMetrics(targetUid, mergedLogs);
}
