import type { EvenUserInfo } from '../domain/types';

function coerceObject(raw: unknown): Record<string, unknown> | null {
	if (raw && typeof raw === 'object') {
		return raw as Record<string, unknown>;
	}

	if (typeof raw === 'string') {
		try {
			const parsed = JSON.parse(raw) as unknown;
			if (parsed && typeof parsed === 'object') {
				return parsed as Record<string, unknown>;
			}
		} catch {
			return null;
		}
	}

	return null;
}

function pickString(source: Record<string, unknown>, keys: string[]): string {
	for (const key of keys) {
		const value = source[key];
		if (typeof value === 'string' && value.trim()) {
			return value.trim();
		}
	}
	return '';
}

function pickUid(source: Record<string, unknown>, keys: string[]): string {
	for (const key of keys) {
		const value = source[key];
		if (typeof value === 'string' && value.trim()) {
			return value.trim();
		}
		if (typeof value === 'number' && Number.isFinite(value)) {
			return String(value);
		}
	}
	return '';
}

export function normalizeEvenUserInfo(raw: unknown): EvenUserInfo | null {
	const source = coerceObject(raw);
	if (!source) {
		return null;
	}

	const uid = pickUid(source, ['uid', 'userId', 'evenUid', 'id']);

	if (!uid) {
		return null;
	}

	return {
		uid,
		name: pickString(source, ['name', 'displayName', 'nickname', 'username']) || 'Even User',
		avatar: pickString(source, ['avatar', 'avatarUrl', 'photoURL', 'photoUrl']),
		country: pickString(source, ['country', 'countryCode', 'localeCountry']) || 'US',
	};
}
