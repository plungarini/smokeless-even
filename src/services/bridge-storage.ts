import { waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';

async function getBridge() {
	return waitForEvenAppBridge();
}

export async function bridgeStorageGet(key: string): Promise<string | null> {
	try {
		const bridge = await getBridge();
		const value = await bridge.getLocalStorage(key);
		return typeof value === 'string' && value.length > 0 ? value : null;
	} catch {
		return null;
	}
}

export async function bridgeStorageSet(key: string, value: string): Promise<void> {
	const bridge = await getBridge();
	await bridge.setLocalStorage(key, value);
}

export async function bridgeStorageRemove(key: string): Promise<void> {
	const bridge = await getBridge();
	await bridge.setLocalStorage(key, '');
}
