import type { UserDocument } from '../../../../../domain/types';
import { DebugLogsCard } from '../../components/DebugLogsCard';
import { AccountHeaderCard } from './AccountHeaderCard';
import { ActionsCard } from './ActionsCard';
import { EvenAccountCard } from './EvenAccountCard';

interface Props {
	userDocument: UserDocument;
	evenName: string;
	canonicalUid: string;
	effectiveGoogleEmail?: string;
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
			<EvenAccountCard userDocument={props.userDocument} evenName={props.evenName} />
			<DebugLogsCard />
			<ActionsCard onExport={props.onExport} onDeleteAll={props.onDeleteAll} />
		</div>
	);
}
