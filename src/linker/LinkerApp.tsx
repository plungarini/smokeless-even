/**
 * Link-site entry point, hosted on GitHub Pages (authorized Firebase
 * domain). This is NOT rendered inside the Even Hub WebView — the user
 * opens it in their phone's browser from the Onboarding screen.
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

type Phase = 'loading' | 'idle' | 'signing-in' | 'authorizing' | 'success' | 'error';

function readCodeFromUrl(): string | null {
	try {
		const code = new URL(window.location.href).searchParams.get('code');
		return code && code.length > 0 ? code.trim() : null;
	} catch {
		return null;
	}
}

export function LinkerApp() {
	const auth = useMemo(() => getFirebaseAuth(), []);
	const [phase, setPhase] = useState<Phase>('loading');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const code = useMemo(() => readCodeFromUrl(), []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			await setPersistence(auth, indexedDBLocalPersistence).catch(() => undefined);
			try {
				const result = await getRedirectResult(auth);
				if (result && code && !cancelled) {
					await finish(code);
					return;
				}
			} catch (error) {
				console.warn('[Linker] getRedirectResult failed', error);
			}
			if (!cancelled) setPhase('idle');
		})();
		return () => { cancelled = true; };
	}, [auth, code]);

	async function finish(handoffCode: string) {
		setPhase('authorizing');
		setErrorMessage(null);
		try {
			await authorizeHandoffCode(handoffCode);
			await signOut(auth).catch(() => undefined);
			try {
				const url = new URL(window.location.href);
				url.searchParams.delete('code');
				window.history.replaceState({}, '', url.toString());
			} catch { /* non-fatal */ }
			setPhase('success');
		} catch (error) {
			console.error('[Linker] authorize failed', error);
			setErrorMessage(error instanceof Error ? error.message : 'Could not link this code.');
			setPhase('error');
		}
	}

	async function startSignIn() {
		if (!code) return;
		setPhase('signing-in');
		setErrorMessage(null);
		const provider = new GoogleAuthProvider();
		try {
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

	if (phase === 'loading') {
		return <Shell><Spinner>Preparing…</Spinner></Shell>;
	}

	if (phase === 'signing-in') {
		return <Shell><Spinner>Opening Google sign-in…</Spinner></Shell>;
	}

	if (phase === 'authorizing') {
		return <Shell><Spinner>Finishing sign-in…</Spinner></Shell>;
	}

	if (phase === 'success') {
		return (
			<Shell>
				<div className="flex flex-col items-center gap-4 py-4 text-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					</div>
					<div>
						<h1 className="text-2xl font-semibold text-text">You're signed in</h1>
						<p className="mt-2 text-[15px] leading-relaxed text-text-dim">
							Return to Smokeless on your glasses — it's finishing sign-in now. You can close this tab.
						</p>
					</div>
				</div>
			</Shell>
		);
	}

	if (!code) {
		return (
			<Shell>
				<div className="flex flex-col items-center gap-3 py-4 text-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/15">
						<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
							<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
							<line x1="12" y1="9" x2="12" y2="13" />
							<line x1="12" y1="17" x2="12.01" y2="17" />
						</svg>
					</div>
					<div>
						<h1 className="text-xl font-semibold text-text">No sign-in code found</h1>
						<p className="mt-2 text-[14px] leading-relaxed text-text-dim">
							Open the Smokeless app on your glasses, tap <strong>Sign in with Google</strong>, then copy and open the link it generates.
						</p>
					</div>
				</div>
			</Shell>
		);
	}

	// idle or error
	return (
		<Shell>
			<div className="flex flex-col gap-5">
				<div>
					<h1 className="text-2xl font-semibold text-text">Sign in to Smokeless</h1>
					<p className="mt-2 text-[15px] leading-relaxed text-text-dim">
						Continue with Google to finish signing in on your glasses.
					</p>
				</div>

				<div className="rounded-[16px] border border-border-light bg-bg px-4 py-3">
					<p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-dim">Sign-in code</p>
					<p className="mt-1 font-mono text-[1.35rem] tracking-[0.22em] text-text">{code}</p>
				</div>

				<Button
					variant="highlight"
					className="w-full rounded-[20px] !text-black"
					onClick={() => void startSignIn()}
				>
					Continue with Google
				</Button>

				{errorMessage ? (
					<div className="flex flex-col gap-3">
						<p className="text-[14px] text-red-400">{errorMessage}</p>
						<Button variant="secondary" className="w-full rounded-[20px]" onClick={() => void startSignIn()}>
							Try again
						</Button>
					</div>
				) : null}
			</div>
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

function Spinner({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center gap-3 py-4 text-text-dim">
			<svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M21 12a9 9 0 1 1-6.219-8.56" />
			</svg>
			<p className="text-[14px]">{children}</p>
		</div>
	);
}

export default LinkerApp;
