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
 *   - Google: shows a pre-compiled sign-in URL (with ?code= embedded) that
 *             the user copies and opens in their phone's browser. Polls for
 *             authorization then signs in via custom token.
 */
export function OnboardingPage() {
	const [mode, setMode] = useState<'idle' | 'picking-local' | 'picking-google'>('idle');
	const [linkUrl, setLinkUrl] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => () => {
		abortRef.current?.abort();
		if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
	}, []);

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
		setLinkUrl(null);
		setCopied(false);
		const controller = new AbortController();
		abortRef.current = controller;
		try {
			await runGoogleHandoff(evenUser.uid, {
				onCode: (_code, url) => setLinkUrl(url),
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

	async function copyLink() {
		if (!linkUrl) return;
		try {
			await navigator.clipboard.writeText(linkUrl);
			setCopied(true);
			if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
			copyTimeoutRef.current = setTimeout(() => setCopied(false), 2500);
		} catch {
			// clipboard API unavailable — user can still tap the link
		}
	}

	function cancelGoogle() {
		abortRef.current?.abort();
		setMode('idle');
		setLinkUrl(null);
		setCopied(false);
	}

	return (
		<div className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10">
			<Card padding="default" className="w-full rounded-[24px] border border-border-light bg-surface p-6">
				<h1 className="font-[DM_Serif_Display] text-4xl tracking-[-0.04em] text-text">Welcome to Smokeless</h1>
				<p className="mt-3 text-normal-body leading-relaxed text-text-dim">
					Choose how Smokeless should store your data. You can't change this later without resetting.
				</p>

				{mode === 'picking-google' ? (
					linkUrl ? (
						<div className="mt-6 flex flex-col gap-4">
							<div className="rounded-[20px] border border-border-light bg-bg p-4">
								<p className="text-[13px] font-medium uppercase tracking-[0.14em] text-text-dim">
									Open this link on your phone's browser
								</p>
								<a
									href={linkUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-2 block break-all text-[13px] leading-relaxed text-text underline underline-offset-2"
								>
									{linkUrl}
								</a>
							</div>
							<Button
								variant="secondary"
								className="w-full rounded-[20px]"
								onClick={() => void copyLink()}
							>
								{copied ? 'Copied!' : 'Copy link'}
							</Button>
							<p className="px-1 text-[13px] leading-relaxed text-text-dim">
								Sign in with Google on that page — we'll detect it automatically and sign you in here.
							</p>
							<Button variant="ghost" className="w-full rounded-[20px]" onClick={cancelGoogle}>
								Cancel
							</Button>
						</div>
					) : (
						<div className="mt-6 flex flex-col items-center gap-3 py-4 text-text-dim">
							<svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M21 12a9 9 0 1 1-6.219-8.56" />
							</svg>
							<p className="text-[14px]">Generating sign-in link…</p>
						</div>
					)
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
							Syncs across devices. Opens a secure sign-in link you copy to your browser.
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
