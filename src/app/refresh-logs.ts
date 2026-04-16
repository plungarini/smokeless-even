import {
	deriveHistoryGroupsFromLogs,
	deriveStatsFromLogs,
	fetchAllLogEntries,
} from '../services/firestore';
import { appStore } from './store';

/**
 * Re-fetch all log entries and derive daily/monthly/history rollups into the
 * app store. Imported by both bootstrap and store actions without creating a
 * circular dependency.
 */
export async function refreshLogs(uid: string): Promise<void> {
	const entries = await fetchAllLogEntries(uid);
	const { daily, monthly } = deriveStatsFromLogs(entries);
	const groups = deriveHistoryGroupsFromLogs(entries);
	appStore.setAllEntries(entries, daily, monthly, groups);
	appStore.setHistoryLoading(false);
}
