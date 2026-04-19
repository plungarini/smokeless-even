import { bridgeStorageGet, bridgeStorageRemove, bridgeStorageSet } from './bridge-storage';

// Bridge Local Storage is the only persistence layer that survives WebView
// refresh inside Even Hub. The user's chosen auth mode MUST live here —
// browser-native storage (localStorage/IndexedDB/cookies) gets wiped.
const AUTH_MODE_STORAGE_KEY = 'smokeless:auth-mode';

export type AuthMode = 'local' | 'google';

function isAuthMode(value: unknown): value is AuthMode {
	return value === 'local' || value === 'google';
}

export async function readStoredAuthMode(): Promise<AuthMode | null> {
	const raw = await bridgeStorageGet(AUTH_MODE_STORAGE_KEY);
	if (!raw) return null;
	return isAuthMode(raw) ? raw : null;
}

export async function writeStoredAuthMode(mode: AuthMode): Promise<void> {
	await bridgeStorageSet(AUTH_MODE_STORAGE_KEY, mode);
}

export async function clearStoredAuthMode(): Promise<void> {
	await bridgeStorageRemove(AUTH_MODE_STORAGE_KEY);
}
