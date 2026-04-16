const required = [
	'VITE_FIREBASE_API_KEY',
	'VITE_FIREBASE_AUTH_DOMAIN',
	'VITE_FIREBASE_PROJECT_ID',
	'VITE_FIREBASE_STORAGE_BUCKET',
	'VITE_FIREBASE_MESSAGING_SENDER_ID',
	'VITE_FIREBASE_APP_ID',
] as const;

export const missingClientEnv = required.filter((key) => !import.meta.env[key]);

export const env = {
	firebaseConfig: {
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
		storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
		messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
		appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
	},
	firebaseFunctionsRegion: import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION ?? 'us-central1',
	googleLinkUrl: import.meta.env.VITE_GOOGLE_LINK_URL ?? '',
};
