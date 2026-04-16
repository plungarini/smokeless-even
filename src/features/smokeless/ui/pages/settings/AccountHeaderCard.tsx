import { Card } from 'even-toolkit/web';
import type { UserDocument } from '../../../../../domain/types';
import { circleIconButtonClass, glassCardClass } from '../../styles';

interface Props {
	userDocument: UserDocument;
	evenName: string;
	effectiveGoogleEmail?: string;
}

export function AccountHeaderCard({ userDocument, evenName, effectiveGoogleEmail }: Props) {
	return (
		<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
			<div className="flex items-center gap-4">
				<div className={`${circleIconButtonClass} h-16 w-16 text-[1.6rem]`}>•</div>
				<div className="min-w-0">
					<div className="truncate text-[1.9rem] font-medium leading-none tracking-[-0.03em] text-text">{evenName}</div>
					<div className="mt-2 truncate text-[15px] text-text-dim">
						{effectiveGoogleEmail || userDocument.providers.even?.uid || 'No linked account yet'}
					</div>
				</div>
			</div>
		</Card>
	);
}
