import { Timestamp, type DocumentData, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { SmokeLogEntry, UserDocument, UserEvenProvider, UserGoogleProvider } from '../domain/types';

export function toDate(value: unknown): Date | null {
	if (!value) return null;
	if (value instanceof Date) return value;
	if (value instanceof Timestamp) return value.toDate();
	if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
		return (value as { toDate: () => Date }).toDate();
	}
	return null;
}

function mapGoogleProvider(value: unknown): UserGoogleProvider | null {
	if (!value || typeof value !== 'object') return null;
	const provider = value as Record<string, unknown>;
	const uid = String(provider.uid ?? '');
	if (!uid) return null;
	return {
		uid,
		email: String(provider.email ?? ''),
		displayName: String(provider.displayName ?? ''),
		linkedAt: toDate(provider.linkedAt),
	};
}

function mapEvenProvider(value: unknown): UserEvenProvider | null {
	if (!value || typeof value !== 'object') return null;
	const provider = value as Record<string, unknown>;
	const uid = String(provider.uid ?? '');
	if (!uid) return null;
	return {
		uid,
		name: String(provider.name ?? ''),
		avatar: String(provider.avatar ?? ''),
		country: String(provider.country ?? ''),
		linkedAt: toDate(provider.linkedAt),
	};
}

export function mapUserDocument(snapshot: FirebaseFirestore.DocumentSnapshot<DocumentData>): UserDocument | null {
	if (!snapshot.exists) return null;
	const data = snapshot.data() ?? {};
	const preferences = (data.preferences as Record<string, unknown> | undefined) ?? {};
	const providers = (data.providers as Record<string, unknown> | undefined) ?? {};
	const todayMax = data.todayMaxCessation as Record<string, unknown> | undefined;

	return {
		createdAt: toDate(data.createdAt),
		updatedAt: toDate(data.updatedAt),
		longestEverCessation: Number(data.longestEverCessation ?? 0),
		todayMaxCessation: todayMax
			? {
				value: Number(todayMax.value ?? 0),
				lastUpdated: toDate(todayMax.lastUpdated),
			}
			: null,
		preferences,
		providers: {
			google: mapGoogleProvider(providers.google),
			even: mapEvenProvider(providers.even),
		},
	};
}

export function mapLog(snapshot: FirebaseFirestore.DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>): SmokeLogEntry {
	const data = snapshot.data() ?? {};
	return {
		id: snapshot.id,
		timestamp: toDate(data.timestamp) ?? new Date(),
		intervalSincePrevious:
			typeof data.intervalSincePrevious === 'number' ? data.intervalSincePrevious : Number(data.intervalSincePrevious ?? null),
	};
}
