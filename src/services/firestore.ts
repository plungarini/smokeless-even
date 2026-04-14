import {
	type DocumentData,
	type DocumentSnapshot,
	type QueryDocumentSnapshot,
	type Timestamp,
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
import type { AuthAccountInfo, AuthProvider, EvenUserInfo, HistoryDayGroup, OnboardingDraft, SmokeEntry, UserProfile } from '../domain/types';
import { db } from '../lib/firebase';
import { addDays, formatLongDate, parseDayKey, toDayKey, toMonthKey, toYearKey } from '../lib/time';

export type HistoryCursor = QueryDocumentSnapshot | null;

interface UserProfileDraft {
	cigarettesPerDay: number;
	packPrice: number;
	cigarettesPerPack: number;
	quitProgram: UserProfile['quitProgram'];
	programStartDate: Date | null;
	programTargetDate: Date | null;
	programTargetCigarettes: number;
	createdAt: Date | null;
	lastSmokeTimestamp: Date | null;
	evenUid: string;
	evenName: string;
	evenAvatar: string;
	evenCountry: string;
	evenUpdatedAt: Date | null;
	authProvider: AuthProvider;
	googleEmail: string;
	googleDisplayName: string;
}

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
	if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as Timestamp).toDate === 'function') {
		return (value as Timestamp).toDate();
	}
	return null;
}

function mapUserProfile(snapshot: DocumentSnapshot): UserProfile | null {
	if (!snapshot.exists()) return null;

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
		authProvider: (data.authProvider as AuthProvider) ?? (String(data.googleEmail ?? '') ? 'google' : 'anonymous'),
		googleEmail: String(data.googleEmail ?? ''),
		googleDisplayName: String(data.googleDisplayName ?? ''),
	};
}

function mapSmokeSnapshot(snapshot: DocumentSnapshot | QueryDocumentSnapshot): SmokeEntry {
	const data = snapshot.data() ?? {};
	return {
		id: snapshot.id,
		timestamp: toDate(data.timestamp) ?? new Date(),
		deletedAt: toDate(data.deletedAt),
	};
}

function buildUserDraft(profile: UserProfile | null, evenUser: EvenUserInfo, lastSmokeTimestamp: Date | null, account: AuthAccountInfo | null = null): UserProfileDraft {
	return {
		cigarettesPerDay: profile?.cigarettesPerDay ?? 20,
		packPrice: profile?.packPrice ?? 0,
		cigarettesPerPack: profile?.cigarettesPerPack ?? 20,
		quitProgram: profile?.quitProgram ?? 'minimum',
		programStartDate: profile?.programStartDate ?? null,
		programTargetDate: profile?.programTargetDate ?? null,
		programTargetCigarettes: profile?.programTargetCigarettes ?? 0,
		createdAt: profile?.createdAt ?? null,
		lastSmokeTimestamp,
		evenUid: evenUser.uid,
		evenName: evenUser.name,
		evenAvatar: evenUser.avatar,
		evenCountry: evenUser.country,
		evenUpdatedAt: new Date(),
		authProvider: account?.authProvider ?? profile?.authProvider ?? 'anonymous',
		googleEmail: account?.googleEmail ?? profile?.googleEmail ?? '',
		googleDisplayName: account?.googleDisplayName ?? profile?.googleDisplayName ?? '',
	};
}

function chooseCreatedAt(a: Date | null, b: Date | null): Date | null {
	if (!a) return b;
	if (!b) return a;
	return a.getTime() <= b.getTime() ? a : b;
}

function chooseProgramStart(a: Date | null, b: Date | null): Date | null {
	if (!a) return b;
	if (!b) return a;
	return a.getTime() <= b.getTime() ? a : b;
}

function mergeProfiles(
	canonical: UserProfile | null,
	legacy: UserProfile | null,
	evenUser: EvenUserInfo,
	lastSmokeTimestamp: Date | null,
	account: AuthAccountInfo | null = null,
): UserProfileDraft {
	return {
		cigarettesPerDay: canonical?.cigarettesPerDay ?? legacy?.cigarettesPerDay ?? 20,
		packPrice: canonical?.packPrice ?? legacy?.packPrice ?? 0,
		cigarettesPerPack: canonical?.cigarettesPerPack ?? legacy?.cigarettesPerPack ?? 20,
		quitProgram: canonical?.quitProgram ?? legacy?.quitProgram ?? 'minimum',
		programStartDate: chooseProgramStart(canonical?.programStartDate ?? null, legacy?.programStartDate ?? null),
		programTargetDate: canonical?.programTargetDate ?? legacy?.programTargetDate ?? null,
		programTargetCigarettes: canonical?.programTargetCigarettes ?? legacy?.programTargetCigarettes ?? 0,
		createdAt: chooseCreatedAt(canonical?.createdAt ?? null, legacy?.createdAt ?? null),
		lastSmokeTimestamp,
		evenUid: evenUser.uid,
		evenName: evenUser.name,
		evenAvatar: evenUser.avatar,
		evenCountry: evenUser.country,
		evenUpdatedAt: new Date(),
		authProvider: account?.authProvider ?? canonical?.authProvider ?? legacy?.authProvider ?? 'anonymous',
		googleEmail: account?.googleEmail ?? canonical?.googleEmail ?? legacy?.googleEmail ?? '',
		googleDisplayName: account?.googleDisplayName ?? canonical?.googleDisplayName ?? legacy?.googleDisplayName ?? '',
	};
}

function lastActiveSmoke(entries: SmokeEntry[]): Date | null {
	return entries
		.filter((entry) => !entry.deletedAt)
		.sort((left, right) => right.timestamp.getTime() - left.timestamp.getTime())[0]?.timestamp ?? null;
}

function buildMigrationKey(entry: SmokeEntry): string {
	return entry.id ? `id:${entry.id}` : `ts:${entry.timestamp.toISOString()}`;
}

function mergeSmokeEntries(canonical: SmokeEntry[], legacy: SmokeEntry[]): SmokeEntry[] {
	const byKey = new Map<string, SmokeEntry>();
	const byTimestamp = new Map<string, SmokeEntry>();

	for (const entry of [...legacy, ...canonical]) {
		const key = buildMigrationKey(entry);
		const timeKey = entry.timestamp.toISOString();
		const existing = byKey.get(key) ?? byTimestamp.get(timeKey);

		if (!existing) {
			byKey.set(key, entry);
			byTimestamp.set(timeKey, entry);
			continue;
		}

		if (existing.deletedAt && !entry.deletedAt) {
			byKey.set(key, entry);
			byTimestamp.set(timeKey, entry);
		}
	}

	return [...new Set(byTimestamp.values())].sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
}

function buildStatsFromSmokes(entries: SmokeEntry[]): Record<string, number> {
	const counts: Record<string, number> = {};

	for (const entry of entries) {
		if (entry.deletedAt) continue;
		for (const periodKey of [toYearKey(entry.timestamp), toMonthKey(entry.timestamp), toDayKey(entry.timestamp)]) {
			counts[periodKey] = (counts[periodKey] ?? 0) + 1;
		}
	}

	return counts;
}

async function getSmokePage(uid: string, pageSize: number, cursor: QueryDocumentSnapshot | null) {
	return cursor
		? getDocs(query(smokesRef(uid), orderBy('timestamp', 'desc'), startAfter(cursor), limit(pageSize)))
		: getDocs(query(smokesRef(uid), orderBy('timestamp', 'desc'), limit(pageSize)));
}

export async function fetchAllSmokeEntries(uid: string): Promise<SmokeEntry[]> {
	const entries: SmokeEntry[] = [];
	let cursor: QueryDocumentSnapshot | null = null;

	while (true) {
		const snapshot = await getSmokePage(uid, 200, cursor);
		if (snapshot.empty) break;

		snapshot.forEach((docSnapshot) => {
			entries.push(mapSmokeSnapshot(docSnapshot));
		});

		cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
		if (snapshot.size < 200) break;
	}

	return entries;
}

async function clearSubcollection(uid: string, name: 'smokes' | 'stats'): Promise<void> {
	while (true) {
		const collectionRef = collection(db, 'users', uid, name);
		const snapshot = await getDocs(query(collectionRef, orderBy(documentId()), limit(200)));
		if (snapshot.empty) break;

		const batch = writeBatch(db);
		snapshot.forEach((docSnapshot) => batch.delete(docSnapshot.ref));
		await batch.commit();

		if (snapshot.size < 200) break;
	}
}

async function writeMergedSmokeData(uid: string, entries: SmokeEntry[], stats: Record<string, number>): Promise<void> {
	const writes: Array<() => Promise<void>> = [];

	for (const entry of entries) {
		writes.push(async () => {
			await setDoc(doc(db, 'users', uid, 'smokes', entry.id), {
				timestamp: entry.timestamp,
				deletedAt: entry.deletedAt ? entry.deletedAt : null,
			});
		});
	}

	for (const [periodKey, count] of Object.entries(stats)) {
		writes.push(async () => {
			await setDoc(doc(db, 'users', uid, 'stats', periodKey), {
				count,
				updatedAt: serverTimestamp(),
			});
		});
	}

	// Firestore batches cap at 500 writes; use smaller chunks for safety.
	for (let index = 0; index < writes.length; index += 200) {
		await Promise.all(writes.slice(index, index + 200).map((commit) => commit()));
	}
}

async function rewriteCanonicalCollections(uid: string, entries: SmokeEntry[], stats: Record<string, number>): Promise<void> {
	await clearSubcollection(uid, 'smokes');
	await clearSubcollection(uid, 'stats');
	await writeMergedSmokeData(uid, entries, stats);
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
	const snapshot = await getDoc(userRef(uid));
	return mapUserProfile(snapshot);
}

export async function ensureCanonicalUserData(firebaseUid: string, evenUser: EvenUserInfo): Promise<void> {
	const [canonicalSnapshot, legacySnapshot] = await Promise.all([getDoc(userRef(firebaseUid)), getDoc(userRef(evenUser.uid))]);
	const canonicalProfile = mapUserProfile(canonicalSnapshot);
	const legacyProfile = firebaseUid === evenUser.uid ? null : mapUserProfile(legacySnapshot);

	if (canonicalProfile?.evenUid === evenUser.uid && (!legacyProfile || firebaseUid === evenUser.uid)) {
		await upsertEvenProfileFields(firebaseUid, evenUser);
		return;
	}

	if (!legacyProfile) {
		if (canonicalProfile) {
			await upsertEvenProfileFields(firebaseUid, evenUser);
		}
		return;
	}

	const [canonicalSmokes, legacySmokes] = await Promise.all([
		fetchAllSmokeEntries(firebaseUid),
		fetchAllSmokeEntries(evenUser.uid),
	]);

	const mergedSmokes = mergeSmokeEntries(canonicalSmokes, legacySmokes);
	const recomputedStats = buildStatsFromSmokes(mergedSmokes);
	const nextLastSmoke = lastActiveSmoke(mergedSmokes);
	const mergedProfile = mergeProfiles(canonicalProfile, legacyProfile, evenUser, nextLastSmoke);

	await rewriteCanonicalCollections(firebaseUid, mergedSmokes, recomputedStats);
	await setDoc(
		userRef(firebaseUid),
		{
			cigarettesPerDay: mergedProfile.cigarettesPerDay,
			packPrice: mergedProfile.packPrice,
			cigarettesPerPack: mergedProfile.cigarettesPerPack,
			quitProgram: mergedProfile.quitProgram,
			programStartDate: mergedProfile.programStartDate,
			programTargetDate: mergedProfile.programTargetDate,
			programTargetCigarettes: mergedProfile.programTargetCigarettes,
			createdAt: mergedProfile.createdAt ?? serverTimestamp(),
			lastSmokeTimestamp: mergedProfile.lastSmokeTimestamp,
			evenUid: mergedProfile.evenUid,
			evenName: mergedProfile.evenName,
			evenAvatar: mergedProfile.evenAvatar,
			evenCountry: mergedProfile.evenCountry,
			evenUpdatedAt: serverTimestamp(),
			authProvider: mergedProfile.authProvider,
			googleEmail: mergedProfile.googleEmail,
			googleDisplayName: mergedProfile.googleDisplayName,
		},
		{ merge: true },
	);
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
	if (!snapshot.exists()) return;

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

export async function upsertAuthProviderFields(uid: string, account: AuthAccountInfo): Promise<void> {
	const snapshot = await getDoc(userRef(uid));
	if (!snapshot.exists()) return;

	await setDoc(
		userRef(uid),
		{
			authProvider: account.authProvider,
			googleEmail: account.googleEmail,
			googleDisplayName: account.googleDisplayName,
		},
		{ merge: true },
	);
}

export async function saveOnboarding(uid: string, evenUser: EvenUserInfo, draft: OnboardingDraft, account: AuthAccountInfo | null = null): Promise<void> {
	const existing = await fetchUserProfile(uid);
	const targetDate = draft.quitProgram === 'minimum' ? null : draft.programTargetDate || null;
	const profile = buildUserDraft(existing, evenUser, existing?.lastSmokeTimestamp ?? null, account);

	await setDoc(
		userRef(uid),
		{
			cigarettesPerDay: draft.cigarettesPerDay,
			packPrice: draft.packPrice,
			cigarettesPerPack: draft.cigarettesPerPack,
			quitProgram: draft.quitProgram,
			programStartDate: profile.programStartDate ?? serverTimestamp(),
			programTargetDate: targetDate ? new Date(`${targetDate}T00:00:00`) : null,
			programTargetCigarettes: draft.quitProgram === 'minimum' ? 0 : draft.programTargetCigarettes,
			createdAt: profile.createdAt ?? serverTimestamp(),
			lastSmokeTimestamp: profile.lastSmokeTimestamp,
			evenUid: profile.evenUid,
			evenName: profile.evenName,
			evenAvatar: profile.evenAvatar,
			evenCountry: profile.evenCountry,
			evenUpdatedAt: serverTimestamp(),
			authProvider: profile.authProvider,
			googleEmail: profile.googleEmail,
			googleDisplayName: profile.googleDisplayName,
		},
		{ merge: true },
	);
}

export async function mergeUserData(sourceUid: string, targetUid: string, evenUser: EvenUserInfo, account: AuthAccountInfo | null = null): Promise<void> {
	if (!sourceUid || !targetUid || sourceUid === targetUid) {
		if (targetUid && account) {
			await upsertAuthProviderFields(targetUid, account);
		}
		return;
	}

	const [targetProfile, sourceProfile, targetSmokes, sourceSmokes] = await Promise.all([
		fetchUserProfile(targetUid),
		fetchUserProfile(sourceUid),
		fetchAllSmokeEntries(targetUid),
		fetchAllSmokeEntries(sourceUid),
	]);

	const mergedSmokes = mergeSmokeEntries(targetSmokes, sourceSmokes);
	const recomputedStats = buildStatsFromSmokes(mergedSmokes);
	const nextLastSmoke = lastActiveSmoke(mergedSmokes);
	const mergedProfile = mergeProfiles(targetProfile, sourceProfile, evenUser, nextLastSmoke, account);

	await rewriteCanonicalCollections(targetUid, mergedSmokes, recomputedStats);
	await setDoc(
		userRef(targetUid),
		{
			cigarettesPerDay: mergedProfile.cigarettesPerDay,
			packPrice: mergedProfile.packPrice,
			cigarettesPerPack: mergedProfile.cigarettesPerPack,
			quitProgram: mergedProfile.quitProgram,
			programStartDate: mergedProfile.programStartDate,
			programTargetDate: mergedProfile.programTargetDate,
			programTargetCigarettes: mergedProfile.programTargetCigarettes,
			createdAt: mergedProfile.createdAt ?? serverTimestamp(),
			lastSmokeTimestamp: mergedProfile.lastSmokeTimestamp,
			evenUid: mergedProfile.evenUid,
			evenName: mergedProfile.evenName,
			evenAvatar: mergedProfile.evenAvatar,
			evenCountry: mergedProfile.evenCountry,
			evenUpdatedAt: serverTimestamp(),
			authProvider: mergedProfile.authProvider,
			googleEmail: mergedProfile.googleEmail,
			googleDisplayName: mergedProfile.googleDisplayName,
		},
		{ merge: true },
	);

	await deleteAllUserData(sourceUid);
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
	if (updates.programTargetDate !== undefined) payload.programTargetDate = updates.programTargetDate;
	if (updates.programStartDate !== undefined) payload.programStartDate = updates.programStartDate;

	await updateDoc(userRef(uid), payload as DocumentData);
}

export async function fetchDailyStats(uid: string, days = 365): Promise<Record<string, number>> {
	const end = new Date();
	const start = addDays(end, -(days - 1));
	const snapshot = await getDocs(
		query(statsRef(uid), where(documentId(), '>=', toDayKey(start)), where(documentId(), '<=', toDayKey(end)), orderBy(documentId())),
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
		query(statsRef(uid), where(documentId(), '>=', toMonthKey(start)), where(documentId(), '<=', toMonthKey(end)), orderBy(documentId())),
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
	let cursor: QueryDocumentSnapshot | null = null;

	while (output.length < maxEntries) {
		const snapshot = await getSmokePage(uid, 200, cursor);
		if (snapshot.empty) break;

		snapshot.forEach((docSnapshot) => {
			if (output.length < maxEntries) {
				output.push(mapSmokeSnapshot(docSnapshot));
			}
		});

		cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
		if (snapshot.size < 200) break;
	}

	return output.filter((entry) => !entry.deletedAt);
}

export async function addSmokeEntry(uid: string, timestamp = new Date()): Promise<string> {
	const smokeDoc = doc(smokesRef(uid));
	const batch = writeBatch(db);

	batch.set(smokeDoc, {
		timestamp,
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
			lastSmokeTimestamp: timestamp,
		},
		{ merge: true },
	);

	await batch.commit();
	return smokeDoc.id;
}

async function findLatestActiveSmoke(uid: string, excludeId?: string): Promise<Date | null> {
	let cursor: QueryDocumentSnapshot | null = null;

	while (true) {
		const snapshot = await getSmokePage(uid, 50, cursor);
		if (snapshot.empty) return null;

		for (const docSnapshot of snapshot.docs) {
			if (docSnapshot.id === excludeId) continue;
			const smoke = mapSmokeSnapshot(docSnapshot);
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

	const smoke = mapSmokeSnapshot(smokeSnapshot);
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
			lastSmokeTimestamp: nextLatest,
		},
		{ merge: true },
	);

	await batch.commit();
}

export async function fetchHistoryPage(uid: string, cursor: HistoryCursor): Promise<{ groups: HistoryDayGroup[]; cursor: HistoryCursor; hasMore: boolean }> {
	const groups: HistoryDayGroup[] = [];
	let lastProcessed: QueryDocumentSnapshot | null = cursor;
	let nextCursor: QueryDocumentSnapshot | null = cursor;
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
			const smoke = mapSmokeSnapshot(docSnapshot);
			lastProcessed = docSnapshot;
			if (smoke.deletedAt) continue;

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
		if (snapshot.size < 200) break;
	}

	return { groups, cursor: nextCursor, hasMore };
}

export async function exportSmokes(uid: string): Promise<{ exportedAt: string; smokes: Array<Record<string, string | null>> }> {
	const snapshot = await getDocs(query(smokesRef(uid), orderBy('timestamp', 'desc')));

	return {
		exportedAt: new Date().toISOString(),
		smokes: snapshot.docs.map((docSnapshot) => {
			const smoke = mapSmokeSnapshot(docSnapshot);
			return {
				id: smoke.id,
				timestamp: smoke.timestamp.toISOString(),
				deletedAt: smoke.deletedAt ? smoke.deletedAt.toISOString() : null,
				dayLabel: formatLongDate(smoke.timestamp),
			};
		}),
	};
}

export async function deleteAllUserData(uid: string): Promise<void> {
	await clearSubcollection(uid, 'smokes');
	await clearSubcollection(uid, 'stats');
	await deleteDoc(userRef(uid));
}
