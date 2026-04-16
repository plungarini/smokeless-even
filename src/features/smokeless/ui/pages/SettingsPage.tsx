import { Badge, Button, Card } from 'even-toolkit/web';
import type { GoogleLinkPairingSession, OnboardingDraft, QuitProgram, UserDocument } from '../../../../domain/types';
import { circleIconButtonClass, detailsCardClass, glassCardClass, sectionLabelClass, smokeInputClass } from '../styles';
import { NumericField } from '../components/NumericField';
import { ProgramChoice } from '../components/ProgramChoice';

function formatExpiry(seconds: number | null): string {
	if (seconds === null) return '';
	const safeSeconds = Math.max(0, seconds);
	const minutes = Math.floor(safeSeconds / 60);
	const remainder = safeSeconds % 60;
	return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function describeGooglePairing(session: GoogleLinkPairingSession | null): string {
	if (!session) {
		return 'Generate a 15-minute pairing code, open the secure link page on a normal browser, then finish Google sign-in there.';
	}

	switch (session.status) {
		case 'pending':
			return 'Enter this code on the link page, then continue with Google in that browser.';
		case 'authorized':
			return session.targetGoogleEmail
				? `Authorized as ${session.targetGoogleEmail}. Smokeless is finishing the secure account handoff now.`
				: 'Authorized in the browser. Smokeless is finishing the secure account handoff now.';
		case 'consumed':
			return 'Google account linked successfully.';
		case 'expired':
			return 'This pairing code expired. Generate a new one to try again.';
		case 'cancelled':
			return 'This pairing request was cancelled. Generate a new code to try again.';
		case 'failed':
			return session.errorMessage || 'Google linking failed. Generate a new code to try again.';
		default:
			return 'Generate a fresh code to link Google.';
	}
}

export function SettingsPage({
	userDocument,
	evenName,
	canonicalUid,
	googleLinked,
	googleLinkSession,
	googleLinkExpiresInSeconds,
	effectiveGoogleEmail,
	effectiveGoogleDisplayName,
	currentCurrency,
	onboardingDraft,
	mutating,
	onGoogleLink,
	onCopyGoogleCode,
	onCopyGoogleLinkUrl,
	onOpenGoogleLinkUrl,
	onDraftChange,
	onProgramSave,
	onResetOnboarding,
	onExport,
	onDeleteAll,
}: {
	userDocument: UserDocument;
	evenName: string;
	canonicalUid: string;
	googleLinked: boolean;
	googleLinkSession: GoogleLinkPairingSession | null;
	googleLinkExpiresInSeconds: number | null;
	effectiveGoogleEmail?: string;
	effectiveGoogleDisplayName?: string;
	currentCurrency: string;
	onboardingDraft: OnboardingDraft;
	mutating: boolean;
	onGoogleLink: () => void;
	onCopyGoogleCode: () => void;
	onCopyGoogleLinkUrl: () => void;
	onOpenGoogleLinkUrl: () => void;
	onDraftChange: (updater: (current: OnboardingDraft) => OnboardingDraft) => void;
	onProgramSave: () => void;
	onResetOnboarding: () => void;
	onExport: () => void;
	onDeleteAll: () => void;
}) {
	const setQuitProgram = (quitProgram: QuitProgram) => onDraftChange((current) => ({ ...current, quitProgram }));

	return (
		<div className="flex flex-col gap-4 pb-4">
			<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
				<div className="flex items-center gap-4">
					<div className={`${circleIconButtonClass} h-16 w-16 text-[1.6rem]`}>•</div>
					<div className="min-w-0">
						<div className="truncate text-[1.9rem] font-medium leading-none tracking-[-0.03em] text-text">{evenName}</div>
						<div className="mt-2 truncate text-[15px] text-text-dim">{effectiveGoogleEmail || userDocument.providers.even?.uid || 'No linked account yet'}</div>
					</div>
				</div>
			</Card>

			<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
				<div className="flex flex-col gap-4">
					<div className={sectionLabelClass}>Account</div>
					<div className="rounded-[20px] border border-white/[0.08] bg-black/[0.14] p-4">
						<div className="flex items-center justify-between gap-4">
							<div>
								<div className="text-[1.1rem] text-text">Firebase account</div>
								<div className="mt-1 break-all text-[14px] text-text-dim">{canonicalUid}</div>
							</div>
							<Badge variant={googleLinked ? 'accent' : 'neutral'}>{googleLinked ? 'Google' : 'Anon'}</Badge>
						</div>
						<div className="mt-3 text-[14px] text-text-dim">{googleLinked ? effectiveGoogleDisplayName || effectiveGoogleEmail || 'Google account linked' : 'Currently using an anonymous Firebase session.'}</div>
					</div>
					{googleLinked ? null : (
						<div className="grid gap-3">
							<div className="rounded-[20px] border border-white/[0.08] bg-black/[0.14] p-4">
								<div className="flex items-center justify-between gap-4">
									<div>
										<div className="text-[1.1rem] text-text">Pair in browser</div>
										<div className="mt-1 text-[14px] text-text-dim">{describeGooglePairing(googleLinkSession)}</div>
									</div>
									<Badge
										variant={
											googleLinkSession?.status === 'authorized' || googleLinkSession?.status === 'consumed'
												? 'accent'
												: 'neutral'
										}
									>
										{googleLinkSession?.status === 'consumed'
											? 'Linked'
											: googleLinkSession?.status === 'authorized'
												? 'Syncing'
											: googleLinkSession?.status === 'pending'
												? 'Pending'
												: googleLinkSession?.status === 'failed'
													? 'Failed'
													: googleLinkSession?.status === 'expired'
														? 'Expired'
														: 'New'}
									</Badge>
								</div>
								{googleLinkSession && googleLinkSession.status !== 'consumed' ? (
									<>
										<div className="mt-4 rounded-[18px] border border-white/[0.06] bg-black/[0.22] px-4 py-3">
											<div className="text-detail uppercase tracking-[0.16em] text-text-dim">Pairing code</div>
											<div className="mt-2 font-mono text-[1.8rem] tracking-[0.18em] text-text">{googleLinkSession.code}</div>
											<div className="mt-2 text-[13px] text-text-dim">
												Expires in {formatExpiry(googleLinkExpiresInSeconds)}
											</div>
										</div>
										<div className="mt-3 text-[13px] break-all text-text-dim">{googleLinkSession.linkUrl}</div>
										<div className="mt-4 grid gap-2 sm:grid-cols-3">
											<Button variant="secondary" className="rounded-[16px]" onClick={onCopyGoogleCode}>
												Copy code
											</Button>
											<Button variant="secondary" className="rounded-[16px]" onClick={onCopyGoogleLinkUrl}>
												Copy link
											</Button>
											<Button variant="secondary" className="rounded-[16px]" onClick={onOpenGoogleLinkUrl}>
												Open link
											</Button>
										</div>
									</>
								) : googleLinkSession?.status === 'consumed' && googleLinkSession.targetGoogleEmail ? (
									<div className="mt-4 rounded-[18px] border border-white/[0.06] bg-black/[0.22] px-4 py-3 text-[14px] text-text-dim">
										Linked as <span className="text-text">{googleLinkSession.targetGoogleEmail}</span>
									</div>
								) : null}
							</div>
							<Button variant="secondary" className="rounded-[20px]" disabled={mutating} onClick={onGoogleLink}>
								{googleLinkSession ? 'Generate new code' : 'Link Google account'}
							</Button>
						</div>
					)}
				</div>
			</Card>

			<details className={detailsCardClass} open>
				<summary>Program</summary>
				<div className="mt-4 grid gap-4">
					<div className="grid gap-3">
						<ProgramChoice value="linear" active={onboardingDraft.quitProgram === 'linear'} description="Gradual reduction toward a date." onSelect={setQuitProgram} />
						<ProgramChoice value="fixed" active={onboardingDraft.quitProgram === 'fixed'} description="Same cap every day." onSelect={setQuitProgram} />
						<ProgramChoice value="minimum" active={onboardingDraft.quitProgram === 'minimum'} description="Track without a limit." onSelect={setQuitProgram} />
					</div>
					<NumericField label="Baseline cigarettes/day" value={onboardingDraft.cigarettesPerDay} onChange={(value) => onDraftChange((current) => ({ ...current, cigarettesPerDay: value }))} />
					<NumericField label={`Pack price (${currentCurrency})`} value={onboardingDraft.packPrice} step="0.01" onChange={(value) => onDraftChange((current) => ({ ...current, packPrice: value }))} />
					<NumericField label="Cigarettes per pack" value={onboardingDraft.cigarettesPerPack} onChange={(value) => onDraftChange((current) => ({ ...current, cigarettesPerPack: value }))} />
					{onboardingDraft.quitProgram !== 'minimum' ? (
						<>
							<NumericField label="Target cigarettes" value={onboardingDraft.programTargetCigarettes} onChange={(value) => onDraftChange((current) => ({ ...current, programTargetCigarettes: value }))} />
							<label className="flex flex-col gap-2">
								<span className="text-detail uppercase tracking-[0.16em] text-text-dim">Target date</span>
								<input className={smokeInputClass} type="date" value={onboardingDraft.programTargetDate} onChange={(event) => onDraftChange((current) => ({ ...current, programTargetDate: event.currentTarget.value }))} />
							</label>
						</>
					) : null}
					<Button variant="highlight" className="rounded-[16px]" disabled={mutating} onClick={onProgramSave}>
						Save program
					</Button>
				</div>
			</details>

			<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
				<div className="flex flex-col gap-3">
					<div className={sectionLabelClass}>Even account</div>
					<p className="text-normal-body text-text">{evenName}</p>
					<p className="text-normal-body text-text-dim">{userDocument.providers.even?.uid || 'Not linked yet'}</p>
				</div>
			</Card>

			<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
				<div className="flex flex-col gap-4">
					<div className={sectionLabelClass}>Actions</div>
					<Button variant="secondary" className="rounded-[20px]" onClick={onResetOnboarding}>
						Onboarding reset
					</Button>
					<Button variant="secondary" className="rounded-[20px]" onClick={onExport}>
						Export JSON
					</Button>
					<Button variant="danger" className="rounded-[20px]" onClick={onDeleteAll}>
						Delete all data
					</Button>
				</div>
			</Card>
		</div>
	);
}
