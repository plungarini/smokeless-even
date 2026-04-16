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

export interface UserDocument {
	createdAt: Date | null;
	updatedAt: Date | null;
	longestEverCessation: number;
	todayMaxCessation: { value: number; lastUpdated: Date | null } | null;
	preferences: Record<string, unknown>;
	providers: {
		google: UserGoogleProvider | null;
		even: UserEvenProvider | null;
	};
}

export interface SmokeLogEntry {
	id: string;
	timestamp: Date;
	intervalSincePrevious: number | null;
}

export interface SessionGoogleUser {
	uid: string;
	email: string;
	displayName: string;
}
