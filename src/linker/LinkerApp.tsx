/**
 * Link-site entry point, hosted on GitHub Pages (authorized Firebase
 * domain). This is NOT rendered inside the Even Hub WebView — the main
 * smokeless app opens it in the phone's default browser so Google Sign-In
 * can use the authorized domain.
 *
 * Flow: user arrives with `?code=XYZ` → signs in with Google → we call
 * `authorizeHandoffCode` to stamp the Firestore doc the WebView is
 * polling → sign out → show "return to glasses".
 */

import { Button, Card } from 'even-toolkit/web';
import {
	GoogleAuthProvider,
	getRedirectResult,
	indexedDBLocalPersistence,
	setPersistence,
	signInWithPopup,
	signInWithRedirect,
	signOut,
} from 'firebase/auth';
import { useEffect, useMemo, useState } from 'react';
import { getFirebaseAuth } from '../lib/firebase';
import { authorizeHandoffCode } from '../services/google-handoff';

type Phase = 'loading' | 'idle' | 'authorizing' | 'success' | 'error';

function readCodeFromUrl(): string | null {
	try {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		return code && code.length > 0 ? code.trim() : null;
	} catch {
		return null;
	}
}

export function LinkerApp() {
	const auth = useMemo(() => getFirebaseAuth(), []);
	const [phase, setPhase] = useState<Phase>('loading');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [codeInput, setCodeInput] = useState('');

	const urlCode = useMemo(() => readCodeFromUrl(), []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			await setPersistence(auth, indexedDBLocalPersistence).catch(() => undefined);
			// Complete a possible redirect sign-in kicked off on a prior visit.
			try {
				const result = await getRedirectResult(auth);
				if (result && urlCode && !cancelled) {
					await finish(urlCode);
					return;
				}
			} catch (error) {
				console.warn('[Linker] getRedirectResult failed', error);
			}
			if (!cancelled) setPhase('idle');
		})();
		return () => {
			cancelled = true;
		};
	}, [auth, urlCode]);

	async function finish(code: string) {
		setPhase('authorizing');
		setErrorMessage(null);
		try {
			await authorizeHandoffCode(code);
			await signOut(auth).catch(() => undefined);
			// Remove `?code=` so a refresh doesn't re-trigger.
			try {
				const url = new URL(window.location.href);
				url.searchParams.delete('code');
				window.history.replaceState({}, '', url.toString());
			} catch {
				// non-fatal
			}
			setPhase('success');
		} catch (error) {
			console.error('[Linker] authorize failed', error);
			setErrorMessage(error instanceof Error ? error.message : 'Could not link this code.');
			setPhase('error');
		}
	}

	async function startSignIn(code: string) {
		setPhase('authorizing');
		setErrorMessage(null);
		const provider = new GoogleAuthProvider();
		try {
			// Prefer popup on desktop. Fall back to redirect where popups are blocked.
			try {
				await signInWithPopup(auth, provider);
			} catch (popupError) {
				console.warn('[Linker] popup failed, falling back to redirect', popupError);
				await signInWithRedirect(auth, provider);
				return;
			}
			await finish(code);
		} catch (error) {
			console.error('[Linker] sign-in failed', error);
			setErrorMessage(error instanceof Error ? error.message : 'Google sign-in failed.');
			setPhase('error');
		}
	}

	const activeCode = urlCode ?? codeInput.trim();

	if (phase === 'loading') {
		return <Shell>Preparing secure link…</Shell>;
	}

	if (phase === 'success') {
		return (
			<Shell>
				<h1 className="text-2xl font-semibold text-text">You're all set</h1>
				<p className="mt-2 text-text-dim">Return to the Smokeless app on your glasses — it's finishing sign-in now.</p>
			</Shell>
		);
	}

	if (phase === 'authorizing') {
		return <Shell>Linking your Google account…</Shell>;
	}

	return (
		<Shell>
			<h1 className="text-2xl font-semibold text-text">Sign in to Smokeless</h1>
			<p className="mt-2 text-text-dim">
				{urlCode
					? 'Continue with Google to finish signing in on your glasses.'
					: 'Paste the code shown on your glasses, then continue with Google.'}
			</p>

			{!urlCode ? (
				<input
					type="text"
					className="mt-4 w-full rounded-[16px] border border-border-light bg-surface px-4 py-3 font-mono text-[1.1rem] tracking-[0.18em] text-text"
					placeholder="PAIRING CODE"
					value={codeInput}
					onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
				/>
			) : null}

			<Button
				variant="highlight"
				className="mt-4 w-full rounded-[20px]"
				disabled={!activeCode}
				onClick={() => activeCode && void startSignIn(activeCode)}
			>
				Continue with Google
			</Button>

			{errorMessage ? <p className="mt-3 text-[14px] text-red-400">{errorMessage}</p> : null}
		</Shell>
	);
}

function Shell({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10">
			<Card padding="default" className="w-full rounded-[24px] border border-border-light bg-surface p-6">
				{children}
			</Card>
		</div>
	);
}

export default LinkerApp;
