/**
 * Firebase bootstrap — LAZY.
 *
 * In Local auth mode the app must never initialize Firebase. To enforce
 * that, this module does zero work at import time: the app/services layer
 * only hits Firebase through the exported proxies (or getters) below, and
 * the first call materializes the SDK. In Local mode nothing here is
 * invoked, so no network calls, no IndexedDB writes, no auth state.
 *
 * Firestore/Firebase-JS rebuilds instances internally when `getAuth()` etc.
 * are called repeatedly, so the lazy-cache pattern here is required to
 * avoid re-init warnings.
 */

import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
	type Auth,
	browserLocalPersistence,
	browserPopupRedirectResolver,
	getAuth,
	initializeAuth,
	onAuthStateChanged,
	type User,
} from 'firebase/auth';
import { type Firestore, getFirestore, initializeFirestore } from 'firebase/firestore';
import { type Functions, getFunctions } from 'firebase/functions';
import { env } from '../config/env';

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let functionsInstance: Functions | null = null;

function ensureApp(): FirebaseApp {
	if (appInstance) return appInstance;
	appInstance = getApps().length > 0 ? getApps()[0]! : initializeApp(env.firebaseConfig);
	return appInstance;
}

export function getFirebaseAuth(): Auth {
	if (authInstance) return authInstance;
	const app = ensureApp();
	try {
		authInstance = initializeAuth(app, {
			persistence: browserLocalPersistence,
			popupRedirectResolver: browserPopupRedirectResolver,
		});
	} catch {
		authInstance = getAuth(app);
	}
	return authInstance;
}

export function getFirebaseDb(): Firestore {
	if (firestoreInstance) return firestoreInstance;
	const app = ensureApp();
	try {
		firestoreInstance = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
	} catch {
		firestoreInstance = getFirestore(app);
	}
	return firestoreInstance;
}

export function getFirebaseFunctions(): Functions {
	if (functionsInstance) return functionsInstance;
	functionsInstance = getFunctions(ensureApp(), env.firebaseFunctionsRegion);
	return functionsInstance;
}

export async function waitForInitialAuthState(): Promise<void> {
	await new Promise<void>((resolve) => {
		const unsubscribe = onAuthStateChanged(getFirebaseAuth(), () => {
			unsubscribe();
			resolve();
		});
	});
}

export function subscribeToAuthState(onValue: (user: User | null) => void): () => void {
	return onAuthStateChanged(getFirebaseAuth(), onValue);
}
