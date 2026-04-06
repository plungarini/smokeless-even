import { signInWithCustomToken } from 'firebase/auth';
import type { EvenUserInfo } from '../domain/types';
import { env } from '../config/env';
import { auth, waitForInitialAuthState } from '../lib/firebase';

async function requestCustomToken(uid: string): Promise<string> {
	const response = await fetch(`${env.authBaseUrl.replace(/\/$/, '')}/auth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ uid }),
	});

	if (!response.ok) {
		throw new Error(`Token mint failed with status ${response.status}`);
	}

	const data = (await response.json()) as { token?: string };
	if (!data.token) {
		throw new Error('Token response was missing `token`.');
	}

	return data.token;
}

export async function ensureFirebaseSession(evenUser: EvenUserInfo): Promise<void> {
	await waitForInitialAuthState();

	if (auth.currentUser?.uid === evenUser.uid) {
		return;
	}

	const token = await requestCustomToken(evenUser.uid);
	await signInWithCustomToken(auth, token);
}
