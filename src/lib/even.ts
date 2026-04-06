import type { EvenUserInfo } from '../domain/types';

function pickString(source: Record<string, unknown>, keys: string[]): string {
	for (const key of keys) {
		const value = source[key];
		if (typeof value === 'string' && value.trim()) {
			return value.trim();
		}
	}
	return '';
}

export function normalizeEvenUserInfo(raw: unknown): EvenUserInfo | null {
	if (!raw || typeof raw !== 'object') {
		return null;
	}

	const source = raw as Record<string, unknown>;
	const uid = pickString(source, ['uid', 'userId', 'evenUid', 'id']);

	if (!uid) {
		return null;
	}

	return {
		uid,
		name: pickString(source, ['name', 'displayName', 'nickname', 'username']) || 'Even user',
		avatar: pickString(source, ['avatar', 'avatarUrl', 'photoURL', 'photoUrl']),
		country: pickString(source, ['country', 'countryCode', 'localeCountry']) || 'US',
	};
}
