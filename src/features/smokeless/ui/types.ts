export type AppTab = 'home' | 'stats' | 'history' | 'settings';
export type StatsPeriod = 'week' | 'month' | 'year';

export const APP_TABS: Array<{ id: AppTab; label: string }> = [
	{ id: 'home', label: 'Home' },
	{ id: 'stats', label: 'Stats' },
	{ id: 'history', label: 'History' },
	{ id: 'settings', label: 'Settings' },
];

export const STATS_PERIODS: Array<{ id: StatsPeriod; label: string }> = [
	{ id: 'week', label: 'Week' },
	{ id: 'month', label: 'Month' },
	{ id: 'year', label: 'Year' },
];
