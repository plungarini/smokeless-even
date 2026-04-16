import type { SmokeLogEntry, UserDocument } from '../domain/types';
import { mapLog, mapUserDocument } from '../lib/firestore-mappers';
import { logsRef, userRef } from './refs';

export async function fetchUserDocument(uid: string): Promise<UserDocument | null> {
	const snapshot = await userRef(uid).get();
	return mapUserDocument(snapshot);
}

export async function fetchAllLogEntries(uid: string): Promise<SmokeLogEntry[]> {
	const snapshot = await logsRef(uid).orderBy('timestamp').get();
	return snapshot.docs.map((docSnapshot) => mapLog(docSnapshot));
}
