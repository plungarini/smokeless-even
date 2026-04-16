import { Badge, Button, Card } from 'even-toolkit/web';
import type { GoogleLinkPairingSession } from '../../../../../domain/types';
import { glassCardClass, sectionLabelClass } from '../../styles';

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
				? `Authorized as ${session.targetGoogleEmail}. Smokeless is now preparing your account transfer.`
				: 'Authorized in the browser. Smokeless is now preparing your account transfer.';
		case 'migrating':
			return 'Smokeless is merging your account data in the background.';
		case 'ready_to_switch':
			if (session.errorCode === 'custom-token-mint-failed') {
				return 'Google account is ready, but Smokeless could not switch auth yet. Check Firebase Functions IAM for custom-token signing.';
			}
			return session.targetGoogleEmail
				? `Ready to switch onto ${session.targetGoogleEmail}. Open Smokeless on your phone to complete the handoff.`
				: 'Your Google account is ready. Open Smokeless on your phone to complete the handoff.';
		case 'switched':
			return 'Smokeless is finishing cleanup after switching onto the linked Google account.';
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

function shouldShowGoogleLinkAction(session: GoogleLinkPairingSession | null): boolean {
	if (!session) return true;
	return session.status === 'failed' || session.status === 'expired' || session.status === 'cancelled';
}

function googleLinkActionLabel(session: GoogleLinkPairingSession | null): string {
	return session ? 'Start new link' : 'Link Google account';
}

function statusBadgeLabel(status: GoogleLinkPairingSession['status'] | undefined): string {
	switch (status) {
		case 'consumed':
			return 'Linked';
		case 'switched':
			return 'Cleaning';
		case 'ready_to_switch':
			return 'Ready';
		case 'migrating':
			return 'Merging';
		case 'authorized':
			return 'Syncing';
		case 'pending':
			return 'Pending';
		case 'failed':
			return 'Failed';
		case 'expired':
			return 'Expired';
		default:
			return 'New';
	}
}

function statusBadgeVariant(status: GoogleLinkPairingSession['status'] | undefined): 'accent' | 'neutral' {
	return status === 'authorized' ||
		status === 'migrating' ||
		status === 'ready_to_switch' ||
		status === 'switched' ||
		status === 'consumed'
		? 'accent'
		: 'neutral';
}

interface Props {
	canonicalUid: string;
	googleLinked: boolean;
	googleLinkSession: GoogleLinkPairingSession | null;
	googleLinkExpiresInSeconds: number | null;
	effectiveGoogleEmail?: string;
	effectiveGoogleDisplayName?: string;
	mutating: boolean;
	onGoogleLink: () => void;
	onCopyGoogleCode: () => void;
	onCopyGoogleLinkUrl: () => void;
	onOpenGoogleLinkUrl: () => void;
}

export function GoogleLinkCard({
	canonicalUid,
	googleLinked,
	googleLinkSession,
	googleLinkExpiresInSeconds,
	effectiveGoogleEmail,
	effectiveGoogleDisplayName,
	mutating,
	onGoogleLink,
	onCopyGoogleCode,
	onCopyGoogleLinkUrl,
	onOpenGoogleLinkUrl,
}: Props) {
	return (
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
					<div className="mt-3 text-[14px] text-text-dim">
						{googleLinked
							? effectiveGoogleDisplayName || effectiveGoogleEmail || 'Google account linked'
							: 'Currently using an anonymous Firebase session.'}
					</div>
				</div>

				{googleLinked ? null : (
					<div className="grid gap-3">
						<div className="rounded-[20px] border border-white/[0.08] bg-black/[0.14] p-4">
							<div className="flex items-center justify-between gap-4">
								<div>
									<div className="text-[1.1rem] text-text">Pair in browser</div>
									<div className="mt-1 text-[14px] text-text-dim">{describeGooglePairing(googleLinkSession)}</div>
								</div>
								<Badge variant={statusBadgeVariant(googleLinkSession?.status)}>
									{statusBadgeLabel(googleLinkSession?.status)}
								</Badge>
							</div>

							{googleLinkSession && googleLinkSession.status === 'pending' ? (
								<>
									<div className="mt-4 rounded-[18px] border border-white/[0.06] bg-black/[0.22] px-4 py-3">
										<div className="text-detail uppercase tracking-[0.16em] text-text-dim">Pairing code</div>
										<div className="mt-2 font-mono text-[1.8rem] tracking-[0.18em] text-text">{googleLinkSession.code}</div>
										<div className="mt-2 text-[13px] text-text-dim">Expires in {formatExpiry(googleLinkExpiresInSeconds)}</div>
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
							) : googleLinkSession?.status === 'ready_to_switch' && googleLinkSession.errorCode === 'custom-token-mint-failed' ? (
								<div className="mt-4 rounded-[18px] border border-white/[0.06] bg-black/[0.22] px-4 py-3 text-[14px] text-text-dim">
									Smokeless is waiting for Firebase Functions IAM permission to mint the switch token.
								</div>
							) : googleLinkSession?.status === 'ready_to_switch' && googleLinkSession.targetGoogleEmail ? (
								<div className="mt-4 rounded-[18px] border border-white/[0.06] bg-black/[0.22] px-4 py-3 text-[14px] text-text-dim">
									Ready to switch to <span className="text-text">{googleLinkSession.targetGoogleEmail}</span>
								</div>
							) : googleLinkSession?.status === 'migrating' ||
								googleLinkSession?.status === 'switched' ||
								googleLinkSession?.status === 'authorized' ? (
								<div className="mt-4 rounded-[18px] border border-white/[0.06] bg-black/[0.22] px-4 py-3 text-[14px] text-text-dim">
									Finishing account transfer…
								</div>
							) : googleLinkSession?.status === 'consumed' && googleLinkSession.targetGoogleEmail ? (
								<div className="mt-4 rounded-[18px] border border-white/[0.06] bg-black/[0.22] px-4 py-3 text-[14px] text-text-dim">
									Linked as <span className="text-text">{googleLinkSession.targetGoogleEmail}</span>
								</div>
							) : null}
						</div>

						{shouldShowGoogleLinkAction(googleLinkSession) ? (
							<Button variant="secondary" className="rounded-[20px]" disabled={mutating} onClick={onGoogleLink}>
								{googleLinkActionLabel(googleLinkSession)}
							</Button>
						) : null}
					</div>
				)}
			</div>
		</Card>
	);
}
