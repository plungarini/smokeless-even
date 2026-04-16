import type { GoogleLinkPairingSession, UserDocument } from '../../../../../domain/types';
import { DebugLogsCard } from '../../components/DebugLogsCard';
import { AccountHeaderCard } from './AccountHeaderCard';
import { ActionsCard } from './ActionsCard';
import { EvenAccountCard } from './EvenAccountCard';
import { GoogleLinkCard } from './GoogleLinkCard';

interface Props {
	userDocument: UserDocument;
	evenName: string;
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
	onExport: () => void;
	onDeleteAll: () => void;
}

export function SettingsPage(props: Props) {
	return (
		<div className="flex flex-col gap-4 pb-4">
			<AccountHeaderCard
				userDocument={props.userDocument}
				evenName={props.evenName}
				effectiveGoogleEmail={props.effectiveGoogleEmail}
			/>

			<GoogleLinkCard
				canonicalUid={props.canonicalUid}
				googleLinked={props.googleLinked}
				googleLinkSession={props.googleLinkSession}
				googleLinkExpiresInSeconds={props.googleLinkExpiresInSeconds}
				effectiveGoogleEmail={props.effectiveGoogleEmail}
				effectiveGoogleDisplayName={props.effectiveGoogleDisplayName}
				mutating={props.mutating}
				onGoogleLink={props.onGoogleLink}
				onCopyGoogleCode={props.onCopyGoogleCode}
				onCopyGoogleLinkUrl={props.onCopyGoogleLinkUrl}
				onOpenGoogleLinkUrl={props.onOpenGoogleLinkUrl}
			/>

			<EvenAccountCard userDocument={props.userDocument} evenName={props.evenName} />

			<DebugLogsCard />

			<ActionsCard onExport={props.onExport} onDeleteAll={props.onDeleteAll} />
		</div>
	);
}
