import { getApps, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, browserPopupRedirectResolver, getAuth, initializeAuth, onAuthStateChanged } from 'firebase/auth';
import { Firestore, getFirestore, initializeFirestore } from 'firebase/firestore';
import { Functions, getFunctions } from 'firebase/functions';
import { env } from '../config/env';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(env.firebaseConfig);

let authInstance: Auth;

try {
	authInstance = initializeAuth(app, {
		persistence: browserLocalPersistence,
		popupRedirectResolver: browserPopupRedirectResolver,
	});
} catch {
	authInstance = getAuth(app);
}

export const auth = authInstance;

let firestoreInstance: Firestore;

try {
	firestoreInstance = initializeFirestore(app, {
		experimentalAutoDetectLongPolling: true,
	});
} catch {
	firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;

export const functions: Functions = getFunctions(app, env.firebaseFunctionsRegion);

export async function waitForInitialAuthState(): Promise<void> {
	await new Promise<void>((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, () => {
			unsubscribe();
			resolve();
		});
	});
}
