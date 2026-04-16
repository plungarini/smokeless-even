export type QuitProgram = 'linear' | 'fixed' | 'minimum';
export type AuthProvider = 'anonymous' | 'google';
export type ThemeMode = 'light' | 'dark' | 'system';
export type WeekStart = 'Monday' | 'Sunday';
export type GoogleLinkSessionStatus =
	| 'pending'
	| 'authorized'
	| 'migrating'
	| 'ready_to_switch'
	| 'switched'
	| 'consumed'
	| 'expired'
	| 'cancelled'
	| 'failed';

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

export interface GoogleLinkPairingSession {
	sessionId: string;
	sourceUid: string;
	code: string;
	linkUrl: string;
	expiresAt: string;
	status: GoogleLinkSessionStatus;
	targetGoogleUid?: string;
	targetGoogleEmail?: string;
	targetGoogleDisplayName?: string;
	switchErrorAt?: string;
	errorCode?: string;
	errorMessage?: string;
}

export interface UserPreferences {
	locale: string;
	themeMode: ThemeMode | string;
	weekStart: WeekStart | string;
}

export interface UserOnboarding {
	cigarettesPerDay: number;
	packPrice: number;
	cigarettesPerPack: number;
	quitProgram: QuitProgram;
	programStartDate: Date | null;
	programTargetDate: Date | null;
	programTargetCigarettes: number;
	completedAt: Date | null;
}

export interface UserGoogleProvider {
	uid: string;
	email: string;
	displayName: string;
	linkedAt: Date | null;
}

export interface UserEvenProvider {
	uid: string;
	name: string;
	avatar: string;
	country: string;
	linkedAt: Date | null;
}

export interface UserProviders {
	google: UserGoogleProvider | null;
	even: UserEvenProvider | null;
}

export interface UserCessationMetric {
	value: number;
	lastUpdated: Date | null;
}

export interface UserDocument {
	createdAt: Date | null;
	updatedAt: Date | null;
	longestEverCessation: number;
	todayMaxCessation: UserCessationMetric | null;
	preferences: UserPreferences;
	onboarding: UserOnboarding | null;
	providers: UserProviders;
}

export interface SmokeLogEntry {
	id: string;
	timestamp: Date;
	intervalSincePrevious: number | null;
}

export interface HistoryDayGroup {
	dayKey: string;
	date: Date;
	count: number;
	entries: SmokeLogEntry[];
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
	entries: SmokeLogEntry[];
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
