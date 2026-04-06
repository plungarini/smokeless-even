export type QuitProgram = 'linear' | 'fixed' | 'minimum';

export interface EvenUserInfo {
	uid: string;
	name: string;
	avatar: string;
	country: string;
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

export interface HudSnapshot {
	todayCount: number;
	lastSmokeAt: Date | null;
	dailyTarget: number | null;
	weightedAverage: number;
	blockedMessage: string | null;
}
