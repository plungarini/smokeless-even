export type QuitProgram = 'linear' | 'fixed' | 'minimum';
export type AuthProvider = 'anonymous' | 'google';

export interface EvenUserInfo {
	uid: string;
	name: string;
	avatar: string;
	country: string;
}

export interface AuthAccountInfo {
	uid: string;
	authProvider: AuthProvider;
	googleEmail: string;
	googleDisplayName: string;
	isAnonymous: boolean;
}

export interface UserProfile {
	cigarettesPerDay: number;
	packPrice: number;
	cigarettesPerPack: number;
	quitProgram: QuitProgram;
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

export interface SmokeEntry {
	id: string;
	timestamp: Date;
	deletedAt: Date | null;
}

export interface HistoryDayGroup {
	dayKey: string;
	date: Date;
	count: number;
	entries: SmokeEntry[];
}

export interface OnboardingDraft {
	cigarettesPerDay: number;
	packPrice: number;
	cigarettesPerPack: number;
	quitProgram: QuitProgram;
	programTargetCigarettes: number;
	programTargetDate: string;
	step: number;
}

export type HudPhase = 'booting' | 'blocked' | 'onboarding' | 'ready';
export type HudPendingAction = 'logSmoke' | 'loadMoreHistory' | null;
export type HudStatsPeriod = 'week' | 'month' | 'year';

export interface HudSeriesDatum {
	key: string;
	label: string;
	count: number;
}

export interface HudHomeSummary {
	todayCount: number;
	lastSmokeAt: Date | null;
	dailyTarget: number | null;
	weightedAverage: number;
}

export interface HudStatsSummary {
	period: HudStatsPeriod;
	totalSmoked: number;
	comparisonLabel: string;
	weightedAverage: number;
	averageIntervalLabel: string;
	series: HudSeriesDatum[];
}

export interface HudHistoryDaySummary {
	dayKey: string;
	date: Date;
	count: number;
	entries: SmokeEntry[];
}

export interface HudHistorySummary {
	days: HudHistoryDaySummary[];
	hasMore: boolean;
	loading: boolean;
}

export interface HudSnapshot {
	phase: HudPhase;
	statusMessage: string | null;
	home: HudHomeSummary;
	stats: Record<HudStatsPeriod, HudStatsSummary>;
	history: HudHistorySummary;
	pendingAction: HudPendingAction;
}
