import { useEffectEvent } from 'react';
import type { SmokeLogEntry } from '../../domain/types';
import { formatTime, toDayKey } from '../../lib/time';
import { appStore } from '../store';

/**
 * React-side wrappers for the store's mutating actions. Each wrapper adds
 * user-visible feedback (toast or confirm dialog) and, in the case of
 * export, triggers a browser download.
 */
export function useSmokeActions(onToast: (message: string) => void) {
	const addSmoke = useEffectEvent(async () => {
		const result = await appStore.logSmoke();
		if (!result.ok && result.errorMessage) onToast(result.errorMessage);
		return result.ok;
	});

	const addPastEntry = useEffectEvent(async (dateInputValue: string, timeInputValue: string) => {
		const ok = await appStore.addPastEntry(dateInputValue, timeInputValue);
		onToast(ok ? 'Past smoke added' : 'Could not add past entry');
		return ok;
	});

	const deleteEntry = useEffectEvent(async (entry: SmokeLogEntry) => {
		if (!window.confirm(`Delete the smoke logged at ${formatTime(entry.timestamp)}?`)) return;
		const ok = await appStore.deleteEntry(entry.id);
		onToast(ok ? 'Entry deleted' : 'Could not delete entry');
	});

	const exportLogs = useEffectEvent(async () => {
		const payload = await appStore.exportLogs();
		if (!payload) return;
		downloadJson(`smokeless-export-${toDayKey(new Date())}.json`, payload);
		onToast('Export ready');
	});

	const deleteAll = useEffectEvent(async () => {
		if (!window.confirm('Delete all Smokeless data?')) return;
		if (!window.confirm('This removes smoke history and linked profile data. Continue?')) return;
		const ok = await appStore.deleteAllData();
		if (ok) onToast('All data deleted');
	});

	return { addSmoke, addPastEntry, deleteEntry, exportLogs, deleteAll };
}

function downloadJson(filename: string, payload: unknown): void {
	const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}
