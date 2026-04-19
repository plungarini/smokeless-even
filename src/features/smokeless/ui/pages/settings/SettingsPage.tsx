import type { UserDocument } from '../../../../../domain/types';
import { DebugLogsCard } from '../../components/DebugLogsCard';
import { AccountHeaderCard } from './AccountHeaderCard';
import { ActionsCard } from './ActionsCard';
import { EvenAccountCard } from './EvenAccountCard';

import type { AuthMode } from '../../../../../services/auth-mode';

interface Props {
	userDocument: UserDocument;
	evenName: string;
	canonicalUid: string;
	authMode: AuthMode | null;
	effectiveGoogleEmail?: string;
	onExport: () => void;
	onSignOut: () => void;
	onDeleteAll: () => void;
}

export function SettingsPage(props: Props) {
	const isGoogle = props.authMode === 'google';
	return (
		<div className="flex flex-col gap-4 pb-4">
			<AccountHeaderCard
				userDocument={props.userDocument}
				evenName={props.evenName}
				effectiveGoogleEmail={props.effectiveGoogleEmail}
			/>
			<EvenAccountCard userDocument={props.userDocument} evenName={props.evenName} />
			<DebugLogsCard />
			<ActionsCard
				onExport={props.onExport}
				onSignOut={props.onSignOut}
				onDeleteAll={props.onDeleteAll}
				signOutLabel={isGoogle ? 'Sign out of Google' : 'Sign out'}
				signOutHint={
					isGoogle
						? 'Returns you to the mode picker. Sign back in with the same Google account to restore your data.'
						: 'Returns you to the mode picker. Your data stays on this device — pick Local again to restore it.'
				}
			/>
		</div>
	);
}
