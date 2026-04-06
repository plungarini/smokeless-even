import {
	type DocumentSnapshot,
	DocumentData,
	QueryDocumentSnapshot,
	Timestamp,
	collection,
	deleteDoc,
	doc,
	documentId,
	getDoc,
	getDocs,
	increment,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	startAfter,
	updateDoc,
	where,
	writeBatch,
} from 'firebase/firestore';
import type { EvenUserInfo, HistoryDayGroup, OnboardingDraft, SmokeEntry, UserProfile } from '../domain/types';
import { db } from '../lib/firebase';
import { addDays, formatLongDate, parseDayKey, toDayKey, toMonthKey, toYearKey } from '../lib/time';

export type HistoryCursor = QueryDocumentSnapshot<DocumentData> | null;

function userRef(uid: string) {
	return doc(db, 'users', uid);
}

function smokesRef(uid: string) {
	return collection(db, 'users', uid, 'smokes');
}

function statsRef(uid: string) {
	return collection(db, 'users', uid, 'stats');
}

function toDate(value: unknown): Date | null {
	if (!value) return null;
	if (value instanceof Timestamp) return value.toDate();
	if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
		return (value as { toDate: () => Date }).toDate();
	}
	return null;
}

function mapUserProfile(snapshot: DocumentSnapshot<DocumentData>): UserProfile | null {
	if (!snapshot.exists()) {
		return null;
	}

	const data = snapshot.data({ serverTimestamps: 'estimate' }) ?? {};

	return {
		cigarettesPerDay: Number(data.cigarettesPerDay ?? 20),
		packPrice: Number(data.packPrice ?? 0),
		cigarettesPerPack: Number(data.cigarettesPerPack ?? 20),
		quitProgram: (data.quitProgram as UserProfile['quitProgram']) ?? 'minimum',
		programStartDate: toDate(data.programStartDate),
		programTargetDate: toDate(data.programTargetDate),
		programTargetCigarettes: Number(data.programTargetCigarettes ?? 0),
		createdAt: toDate(data.createdAt),
		lastSmokeTimestamp: toDate(data.lastSmokeTimestamp),
		evenUid: String(data.evenUid ?? ''),
		evenName: String(data.evenName ?? ''),
		evenAvatar: String(data.evenAvatar ?? ''),
		evenCountry: String(data.evenCountry ?? 'US'),
		evenUpdatedAt: toDate(data.evenUpdatedAt),
	};
}

function mapSmokeEntry(snapshot: QueryDocumentSnapshot<DocumentData>): SmokeEntry {
	const data = snapshot.data();
	return {
		id: snapshot.id,
		timestamp: toDate(data.timestamp) ?? new Date(),
		deletedAt: toDate(data.deletedAt),
	};
}

async function getSmokePage(uid: string, pageSize: number, cursor: QueryDocumentSnapshot<DocumentData> | null) {
	return cursor
		? getDocs(query(smokesRef(uid), orderBy('timestamp', 'desc'), startAfter(cursor), limit(pageSize)))
		: getDocs(query(smokesRef(uid), orderBy('timestamp', 'desc'), limit(pageSize)));
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
	const snapshot = await getDoc(userRef(uid));
	return mapUserProfile(snapshot);
}

export function subscribeToUserProfile(uid: string, onValue: (profile: UserProfile | null) => void): () => void {
	return onSnapshot(userRef(uid), (snapshot) => {
		onValue(mapUserProfile(snapshot));
	});
}

export function subscribeToTodayCount(uid: string, onValue: (count: number) => void): () => void {
	const todayKey = toDayKey(new Date());
	return onSnapshot(doc(db, 'users', uid, 'stats', todayKey), (snapshot) => {
		onValue(Number(snapshot.data()?.count ?? 0));
	});
}

export async function upsertEvenProfileFields(uid: string, evenUser: EvenUserInfo): Promise<void> {
	const snapshot = await getDoc(userRef(uid));
	if (!snapshot.exists()) {
		return;
	}

	await setDoc(
		userRef(uid),
		{
			evenUid: evenUser.uid,
			evenName: evenUser.name,
			evenAvatar: evenUser.avatar,
			evenCountry: evenUser.country,
			evenUpdatedAt: serverTimestamp(),
		},
		{ merge: true },
	);
}

export async function saveOnboarding(uid: string, evenUser: EvenUserInfo, draft: OnboardingDraft): Promise<void> {
	const existing = await fetchUserProfile(uid);
	const targetDate = draft.quitProgram === 'minimum' ? null : draft.programTargetDate || null;

	await setDoc(
		userRef(uid),
		{
			cigarettesPerDay: draft.cigarettesPerDay,
			packPrice: draft.packPrice,
			cigarettesPerPack: draft.cigarettesPerPack,
			quitProgram: draft.quitProgram,
			programStartDate: serverTimestamp(),
			programTargetDate: targetDate ? Timestamp.fromDate(new Date(`${targetDate}T00:00:00`)) : null,
			programTargetCigarettes: draft.quitProgram === 'minimum' ? 0 : draft.programTargetCigarettes,
			createdAt: existing?.createdAt ? Timestamp.fromDate(existing.createdAt) : serverTimestamp(),
			lastSmokeTimestamp: existing?.lastSmokeTimestamp ? Timestamp.fromDate(existing.lastSmokeTimestamp) : null,
			evenUid: evenUser.uid,
			evenName: evenUser.name,
			evenAvatar: evenUser.avatar,
			evenCountry: evenUser.country,
			evenUpdatedAt: serverTimestamp(),
		},
		{ merge: true },
	);
}

export async function updateProgram(uid: string, updates: Partial<UserProfile>): Promise<void> {
	const payload: Record<string, unknown> = {
		evenUpdatedAt: serverTimestamp(),
	};

	if (typeof updates.cigarettesPerDay === 'number') payload.cigarettesPerDay = updates.cigarettesPerDay;
	if (typeof updates.packPrice === 'number') payload.packPrice = updates.packPrice;
	if (typeof updates.cigarettesPerPack === 'number') payload.cigarettesPerPack = updates.cigarettesPerPack;
	if (updates.quitProgram) payload.quitProgram = updates.quitProgram;
	if (typeof updates.programTargetCigarettes === 'number') payload.programTargetCigarettes = updates.programTargetCigarettes;
	if (updates.programTargetDate !== undefined) {
		payload.programTargetDate = updates.programTargetDate ? Timestamp.fromDate(updates.programTargetDate) : null;
	}
	if (updates.programStartDate !== undefined) {
		payload.programStartDate = updates.programStartDate ? Timestamp.fromDate(updates.programStartDate) : null;
	}

	await updateDoc(userRef(uid), payload as DocumentData);
}

export async function fetchDailyStats(uid: string, days = 365): Promise<Record<string, number>> {
	const end = new Date();
	const start = addDays(end, -(days - 1));
	const snapshot = await getDocs(
		query(
			statsRef(uid),
			where(documentId(), '>=', toDayKey(start)),
			where(documentId(), '<=', toDayKey(end)),
			orderBy(documentId()),
		),
	);

	const output: Record<string, number> = {};
	snapshot.forEach((docSnapshot) => {
		if (/^\d{4}-\d{2}-\d{2}$/.test(docSnapshot.id)) {
			output[docSnapshot.id] = Number(docSnapshot.data().count ?? 0);
		}
	});

	return output;
}

export async function fetchMonthlyStats(uid: string, months = 18): Promise<Record<string, number>> {
	const end = new Date();
	const start = new Date(end.getFullYear(), end.getMonth() - (months - 1), 1);
	const snapshot = await getDocs(
		query(
			statsRef(uid),
			where(documentId(), '>=', toMonthKey(start)),
			where(documentId(), '<=', toMonthKey(end)),
			orderBy(documentId()),
		),
	);

	const output: Record<string, number> = {};
	snapshot.forEach((docSnapshot) => {
		if (/^\d{4}-\d{2}$/.test(docSnapshot.id)) {
			output[docSnapshot.id] = Number(docSnapshot.data().count ?? 0);
		}
	});

	return output;
}

export async function fetchRecentSmokes(uid: string, maxEntries = 800): Promise<SmokeEntry[]> {
	const output: SmokeEntry[] = [];
	let cursor: QueryDocumentSnapshot<DocumentData> | null = null;

	while (output.length < maxEntries) {
		const snapshot = await getSmokePage(uid, 200, cursor);
		if (snapshot.empty) break;

		snapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
			if (output.length < maxEntries) {
				output.push(mapSmokeEntry(docSnapshot));
			}
		});

		cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
		if (snapshot.size < 200) break;
	}

	return output.filter((entry) => !entry.deletedAt);
}

export async function addSmokeEntry(uid: string, timestamp = new Date()): Promise<string> {
	const smokeDoc = doc(smokesRef(uid));
	const smokeTimestamp = Timestamp.fromDate(timestamp);
	const batch = writeBatch(db);

	batch.set(smokeDoc, {
		timestamp: smokeTimestamp,
		deletedAt: null,
	});

	for (const periodKey of [toYearKey(timestamp), toMonthKey(timestamp), toDayKey(timestamp)]) {
		batch.set(
			doc(db, 'users', uid, 'stats', periodKey),
			{
				count: increment(1),
				updatedAt: serverTimestamp(),
			},
			{ merge: true },
		);
	}

	batch.set(
		userRef(uid),
		{
			lastSmokeTimestamp: smokeTimestamp,
		},
		{ merge: true },
	);

	await batch.commit();
	return smokeDoc.id;
}

async function findLatestActiveSmoke(uid: string, excludeId?: string): Promise<Date | null> {
	let cursor: QueryDocumentSnapshot<DocumentData> | null = null;

	while (true) {
		const snapshot = await getSmokePage(uid, 50, cursor);
		if (snapshot.empty) return null;

		for (const docSnapshot of snapshot.docs) {
			if (docSnapshot.id === excludeId) continue;
			const smoke = mapSmokeEntry(docSnapshot);
			if (!smoke.deletedAt) {
				return smoke.timestamp;
			}
		}

		cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
		if (snapshot.size < 50) return null;
	}
}

export async function softDeleteSmokeEntry(uid: string, smokeId: string): Promise<void> {
	const smokeDocRef = doc(db, 'users', uid, 'smokes', smokeId);
	const smokeSnapshot = await getDoc(smokeDocRef);
	if (!smokeSnapshot.exists()) return;

	const smoke = mapSmokeEntry(smokeSnapshot as QueryDocumentSnapshot<DocumentData>);
	if (smoke.deletedAt) return;

	const nextLatest = await findLatestActiveSmoke(uid, smokeId);
	const batch = writeBatch(db);

	batch.update(smokeDocRef, {
		deletedAt: serverTimestamp(),
	});

	for (const periodKey of [toYearKey(smoke.timestamp), toMonthKey(smoke.timestamp), toDayKey(smoke.timestamp)]) {
		batch.set(
			doc(db, 'users', uid, 'stats', periodKey),
			{
				count: increment(-1),
				updatedAt: serverTimestamp(),
			},
			{ merge: true },
		);
	}

	batch.set(
		userRef(uid),
		{
			lastSmokeTimestamp: nextLatest ? Timestamp.fromDate(nextLatest) : null,
		},
		{ merge: true },
	);

	await batch.commit();
}

export async function fetchHistoryPage(uid: string, cursor: HistoryCursor): Promise<{
	groups: HistoryDayGroup[];
	cursor: HistoryCursor;
	hasMore: boolean;
}> {
	const groups: HistoryDayGroup[] = [];
	let lastProcessed: QueryDocumentSnapshot<DocumentData> | null = cursor;
	let nextCursor: QueryDocumentSnapshot<DocumentData> | null = cursor;
	let hasMore = false;
	let pendingCursor = cursor;

	while (groups.length < 30) {
		const snapshot = await getSmokePage(uid, 200, pendingCursor);
		if (snapshot.empty) {
			nextCursor = null;
			hasMore = false;
			break;
		}

		let reachedLimit = false;

		for (const docSnapshot of snapshot.docs) {
			const smoke = mapSmokeEntry(docSnapshot);
			lastProcessed = docSnapshot;

			if (smoke.deletedAt) {
				continue;
			}

			const dayKey = toDayKey(smoke.timestamp);
			const lastGroup = groups[groups.length - 1];

			if (!lastGroup || lastGroup.dayKey !== dayKey) {
				if (groups.length === 30) {
					reachedLimit = true;
					break;
				}
				groups.push({
					dayKey,
					date: parseDayKey(dayKey),
					count: 0,
					entries: [],
				});
			}

			const currentGroup = groups[groups.length - 1];
			currentGroup.entries.push(smoke);
			currentGroup.count += 1;
		}

		if (reachedLimit) {
			nextCursor = lastProcessed;
			hasMore = true;
			break;
		}

		pendingCursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
		nextCursor = pendingCursor;
		hasMore = snapshot.size === 200;

		if (snapshot.size < 200) {
			break;
		}
	}

	return { groups, cursor: nextCursor, hasMore };
}

export async function exportSmokes(uid: string): Promise<{ exportedAt: string; smokes: Array<Record<string, string | null>> }> {
	const snapshot = await getDocs(query(smokesRef(uid), orderBy('timestamp', 'desc')));

	return {
		exportedAt: new Date().toISOString(),
		smokes: snapshot.docs.map((docSnapshot) => {
			const smoke = mapSmokeEntry(docSnapshot);
			return {
				id: smoke.id,
				timestamp: smoke.timestamp.toISOString(),
				deletedAt: smoke.deletedAt ? smoke.deletedAt.toISOString() : null,
				dayLabel: formatLongDate(smoke.timestamp),
			};
		}),
	};
}

async function deleteCollection(path: string[]): Promise<void> {
	while (true) {
		const collectionRef = collection(db, path.join('/'));
		const snapshot = await getDocs(query(collectionRef, orderBy(documentId()), limit(200)));
		if (snapshot.empty) break;

		const batch = writeBatch(db);
		snapshot.forEach((docSnapshot) => batch.delete(docSnapshot.ref));
		await batch.commit();

		if (snapshot.size < 200) break;
	}
}

export async function deleteAllUserData(uid: string): Promise<void> {
	await deleteCollection(['users', uid, 'smokes']);
	await deleteCollection(['users', uid, 'stats']);
	await deleteDoc(userRef(uid));
}
