import { getApps, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, getAuth, initializeAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { env } from '../config/env';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(env.firebaseConfig);

let authInstance: Auth;

try {
	authInstance = initializeAuth(app, {
		persistence: browserLocalPersistence,
	});
} catch {
	authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);

export async function waitForInitialAuthState(): Promise<void> {
	await new Promise<void>((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, () => {
			unsubscribe();
			resolve();
		});
	});
}
