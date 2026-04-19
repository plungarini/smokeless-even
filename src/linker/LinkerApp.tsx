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
import { auth } from '../lib/firebase';
import { finalizeGoogleLinkSession, resolveGoogleLinkCode } from '../services/google-link';

type LinkerPhase = 'idle' | 'ready' | 'authorizing' | 'success' | 'error';

interface ResolvedPairing {
	sessionId: string;
	expiresAt: string;
}

function normalizeCode(value: string): string {
	return value
		.toUpperCase()
		.replace(/[^A-Z2-9]/g, '')
		.slice(0, 10);
}

function formatCodeInput(value: string): string {
	const normalized = normalizeCode(value);
	if (normalized.length <= 5) return normalized;
	return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}

function readStoredPairing(): ResolvedPairing | null {
	if (typeof window === 'undefined') return null;

	try {
		const params = new URLSearchParams(window.location.search);
		const sessionId = params.get('sessionId');
		const expiresAt = params.get('expiresAt');
		if (!sessionId || !expiresAt) {
			return null;
		}
		return {
			sessionId,
			expiresAt,
		};
	} catch {
		return null;
	}
}

function writeStoredPairing(pairing: ResolvedPairing | null): void {
	if (typeof window === 'undefined') return;

	const url = new URL(window.location.href);
	if (!pairing) {
		url.searchParams.delete('sessionId');
		url.searchParams.delete('expiresAt');
		window.history.replaceState(null, '', url.toString());
		return;
	}

	url.searchParams.set('sessionId', pairing.sessionId);
	url.searchParams.set('expiresAt', pairing.expiresAt);
	window.history.replaceState(null, '', url.toString());
}

function shouldPreferRedirect(): boolean {
	if (typeof navigator === 'undefined') return false;
	const agent = navigator.userAgent;
	const isIos = /iPad|iPhone|iPod/.test(agent);
	const isSafari = /Safari/.test(agent) && !/Chrome|CriOS|Edg|FxiOS/.test(agent);
	return isIos || isSafari;
}

function shouldFallbackToRedirect(error: unknown): boolean {
	if (!error || typeof error !== 'object' || !('code' in error)) return false;
	const code = String((error as { code?: string }).code ?? '');
	return (
		code === 'auth/popup-blocked' ||
		code === 'auth/web-storage-unsupported' ||
		code === 'auth/operation-not-supported-in-this-environment'
	);
}

function formatExpiry(seconds: number): string {
	const safe = Math.max(0, seconds);
	const minutes = Math.floor(safe / 60);
	const remainder = safe % 60;
	return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export function LinkerApp() {
	const [codeInput, setCodeInput] = useState('');
	const [phase, setPhase] = useState<LinkerPhase>('idle');
	const [resolvedPairing, setResolvedPairing] = useState<ResolvedPairing | null>(() => readStoredPairing());
	const [message, setMessage] = useState('Enter the pairing code from Smokeless to continue.');
	const [linkedEmail, setLinkedEmail] = useState('');
	const [postAuthError, setPostAuthError] = useState(false);
	const [clock, setClock] = useState(() => Date.now());

	useEffect(() => {
		const timer = window.setInterval(() => setClock(Date.now()), 1_000);
		return () => window.clearInterval(timer);
	}, []);

	useEffect(() => {
		let cancelled = false;

		const initialize = async () => {
			await setPersistence(auth, indexedDBLocalPersistence);
			const storedPairing = readStoredPairing();
			const redirectResult = await getRedirectResult(auth);

			if (cancelled) return;

			if (redirectResult?.user && storedPairing) {
				setResolvedPairing(storedPairing);
				setPhase('authorizing');
				setMessage('Preparing your Smokeless data...');
				try {
					const migration = await finalizeGoogleLinkSession(storedPairing.sessionId);
					if (cancelled) return;
					setLinkedEmail(migration.targetGoogleEmail ?? redirectResult.user.email ?? '');
					setPostAuthError(false);
					setPhase('success');
					setMessage('Google account linked successfully. Return to Smokeless to finish the account switch.');
					writeStoredPairing(null);
					setResolvedPairing(null);
					await signOut(auth);
				} catch (error) {
					console.error('[Smokeless Link] redirect completion failed', error);
					if (cancelled) return;
					setLinkedEmail(redirectResult.user.email ?? '');
					setPostAuthError(true);
					setPhase('error');
					setMessage(
						error instanceof Error
							? error.message
							: 'Google access was approved, but Smokeless could not finish linking.',
					);
				}
				return;
			}

			if (auth.currentUser && storedPairing) {
				setResolvedPairing(storedPairing);
				setPhase('ready');
				setMessage('Continue with Google to finish linking.');
				return;
			}

			if (storedPairing) {
				setResolvedPairing(storedPairing);
				setPhase('ready');
				setMessage('Continue with Google to finish linking.');
			}
		};

		void initialize().catch((error) => {
			console.error('[Smokeless Link] initialization failed', error);
			if (cancelled) return;
			setPhase('error');
			setMessage(error instanceof Error ? error.message : 'Could not start the Google link page.');
		});

		return () => {
			cancelled = true;
		};
	}, []);

	const expiresInSeconds = useMemo(() => {
		if (!resolvedPairing) return 0;
		return Math.max(0, Math.floor((new Date(resolvedPairing.expiresAt).getTime() - clock) / 1000));
	}, [clock, resolvedPairing]);

	const handleResolveCode = async () => {
		const normalized = normalizeCode(codeInput);
		if (normalized.length !== 10) {
			setPostAuthError(false);
			setPhase('error');
			setMessage('Enter the full 10-character code shown in Smokeless.');
			return;
		}

		setPostAuthError(false);
		setPhase('authorizing');
		setMessage('Checking pairing code...');
		try {
			const result = await resolveGoogleLinkCode(normalized);
			const pairing = {
				sessionId: result.sessionId,
				expiresAt: result.expiresAt,
			};
			writeStoredPairing(pairing);
			setResolvedPairing(pairing);
			setPhase('ready');
			setMessage('Code verified. Continue with Google in this browser.');
		} catch (error) {
			console.error('[Smokeless Link] resolve failed', error);
			setPostAuthError(false);
			setPhase('error');
			setMessage(error instanceof Error ? error.message : 'Pairing code not recognized.');
		}
	};

	const handleGoogleContinue = async () => {
		if (!resolvedPairing) return;

		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: 'select_account' });

		writeStoredPairing(resolvedPairing);
		setPostAuthError(false);
		setPhase('authorizing');
		setMessage('Opening Google sign-in...');

		try {
			if (shouldPreferRedirect()) {
				await signInWithRedirect(auth, provider);
				return;
			}

			const result = await signInWithPopup(auth, provider);
			const migration = await finalizeGoogleLinkSession(resolvedPairing.sessionId);
			setLinkedEmail(migration.targetGoogleEmail ?? result.user.email ?? '');
			setPostAuthError(false);
			setPhase('success');
			setMessage('Google account linked successfully. Return to Smokeless to finish the account switch.');
			writeStoredPairing(null);
			setResolvedPairing(null);
			await signOut(auth);
		} catch (error) {
			if (shouldFallbackToRedirect(error)) {
				await signInWithRedirect(auth, provider);
				return;
			}

			console.error('[Smokeless Link] google auth failed', error);
			if (auth.currentUser) {
				setLinkedEmail(auth.currentUser.email ?? linkedEmail);
				setPostAuthError(true);
			}
			setPhase('error');
			setMessage(
				error instanceof Error
					? error.message
					: auth.currentUser
						? 'Google access was approved, but Smokeless could not finish linking.'
						: 'Could not complete Google sign-in.',
			);
		}
	};

	const showFinalState = phase === 'success' || postAuthError;

	return (
		<div className="linker-shell">
			<div className="linker-orb linker-orb-left" />
			<div className="linker-orb linker-orb-right" />

			<div className="linker-frame">
				<Card padding="default" className="linker-card">
					<div className="linker-eyebrow">Smokeless Pairing</div>
					<h1 className="linker-title">{phase === 'success' ? 'Google Account Linked!' : 'Link Google Account'}</h1>
					<p className="linker-body">{message}</p>

					{linkedEmail ? (
						<div className="linker-chip">
							{phase === 'success' ? 'Linked as ' : 'Authorized as '}
							{linkedEmail}
						</div>
					) : null}

					{showFinalState ? null : (
						<>
							<div className="linker-section">
								<label className="linker-label" htmlFor="pairing-code">
									Pairing code
								</label>
								<input
									id="pairing-code"
									className="linker-input"
									value={formatCodeInput(codeInput)}
									onChange={(event) => setCodeInput(event.currentTarget.value)}
									placeholder="ABCDE-FGHIJ"
									autoComplete="one-time-code"
									autoCapitalize="characters"
									spellCheck={false}
									disabled={phase === 'authorizing'}
								/>
								<Button
									variant="secondary"
									className="linker-button"
									onClick={() => void handleResolveCode()}
									disabled={phase === 'authorizing'}
								>
									Verify code
								</Button>
							</div>

							{resolvedPairing ? (
								<div className="linker-session">
									<div>
										<div className="linker-label">Session</div>
										<div className="linker-meta">{resolvedPairing.sessionId}</div>
									</div>
									<div>
										<div className="linker-label">Expires in</div>
										<div className="linker-countdown">{formatExpiry(expiresInSeconds)}</div>
									</div>
								</div>
							) : null}

							<Button
								variant="highlight"
								className="linker-button linker-button-primary !text-black"
								onClick={() => void handleGoogleContinue()}
								disabled={!resolvedPairing || phase === 'authorizing' || expiresInSeconds === 0}
							>
								Continue with Google
							</Button>
						</>
					)}
				</Card>
			</div>
		</div>
	);
}
