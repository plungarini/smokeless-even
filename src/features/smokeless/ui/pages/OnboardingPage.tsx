import { Button, Card } from 'even-toolkit/web';
import { useEffect, useRef, useState } from 'react';
import { completeOnboarding } from '../../../../app/bootstrap';
import { runGoogleHandoff } from '../../../../services/google-handoff';
import { appStore } from '../../../../app/store';

/**
 * First-launch auth-mode picker. Shown when `phase === 'onboarding'`.
 *
 * Two mutually exclusive choices:
 *   - Local: no account, data in Bridge Local Storage only.
 *   - Google: opens GitHub Pages in the phone's browser for Google sign-in,
 *             polls for authorization, then signs in via custom token.
 */
export function OnboardingPage() {
	const [mode, setMode] = useState<'idle' | 'picking-local' | 'picking-google'>('idle');
	const [pairingCode, setPairingCode] = useState<string | null>(null);
	const [pairingUrl, setPairingUrl] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => () => abortRef.current?.abort(), []);

	async function pickLocal() {
		setMode('picking-local');
		setErrorMessage(null);
		try {
			await completeOnboarding('local');
		} catch (error) {
			console.error('[Onboarding] local failed', error);
			setErrorMessage('Could not start Local mode.');
			setMode('idle');
		}
	}

	async function pickGoogle() {
		const evenUser = appStore.getState().evenUser;
		if (!evenUser) {
			setErrorMessage('Even user not ready yet. Try again in a moment.');
			return;
		}
		setMode('picking-google');
		setErrorMessage(null);
		setPairingCode(null);
		setPairingUrl(null);
		const controller = new AbortController();
		abortRef.current = controller;
		try {
			await runGoogleHandoff(evenUser.uid, {
				onCode: (code, linkUrl) => {
					setPairingCode(code);
					setPairingUrl(linkUrl);
				},
				signal: controller.signal,
			});
			await completeOnboarding('google');
		} catch (error) {
			console.error('[Onboarding] google handoff failed', error);
			const code = error instanceof Error ? error.message : String(error);
			setErrorMessage(
				code === 'handoff-timeout'
					? 'The code expired. Try again.'
					: code === 'cancelled'
						? null
						: 'Could not finish Google sign-in.',
			);
			setMode('idle');
		}
	}

	function cancelGoogle() {
		abortRef.current?.abort();
		setMode('idle');
		setPairingCode(null);
		setPairingUrl(null);
	}

	return (
		<div className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10">
			<Card padding="default" className="w-full rounded-[24px] border border-border-light bg-surface p-6">
				<h1 className="font-[DM_Serif_Display] text-4xl tracking-[-0.04em] text-text">Welcome to Smokeless</h1>
				<p className="mt-3 text-normal-body leading-relaxed text-text-dim">
					Choose how Smokeless should store your data. You can't change this later without resetting.
				</p>

				{mode === 'picking-google' && pairingCode ? (
					<div className="mt-6 flex flex-col gap-4">
						<div className="rounded-[20px] border border-border-light bg-bg p-4">
							<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Pairing code</div>
							<div className="mt-2 font-mono text-[2rem] tracking-[0.2em] text-text">{pairingCode}</div>
						</div>
						<p className="text-[14px] text-text-dim">
							We opened the sign-in page in your browser. If nothing happened, open this link:
						</p>
						{pairingUrl ? (
							<a
								className="break-all text-[13px] text-text underline"
								href={pairingUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								{pairingUrl}
							</a>
						) : null}
						<Button variant="secondary" className="w-full rounded-[20px]" onClick={cancelGoogle}>
							Cancel
						</Button>
					</div>
				) : (
					<div className="mt-6 flex flex-col gap-3">
						<Button
							variant="highlight"
							className="w-full rounded-[20px] !text-black"
							disabled={mode !== 'idle'}
							onClick={() => void pickGoogle()}
						>
							Sign in with Google
						</Button>
						<p className="px-1 text-[12px] text-text-dim">
							Syncs across devices. Opens a secure sign-in page in your browser.
						</p>
						<Button
							variant="secondary"
							className="mt-3 w-full rounded-[20px]"
							disabled={mode !== 'idle'}
							onClick={() => void pickLocal()}
						>
							Continue without an account
						</Button>
						<p className="px-1 text-[12px] text-text-dim">Data stays on this device. No sync.</p>
					</div>
				)}

				{errorMessage ? <p className="mt-4 text-[14px] text-red-400">{errorMessage}</p> : null}
			</Card>
		</div>
	);
}
