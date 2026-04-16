import { Card } from 'even-toolkit/web';
import type { UserDocument } from '../../../../../domain/types';
import { glassCardClass, sectionLabelClass } from '../../styles';

interface Props {
	userDocument: UserDocument;
	evenName: string;
}

export function EvenAccountCard({ userDocument, evenName }: Props) {
	return (
		<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
			<div className="flex flex-col gap-3">
				<div className={sectionLabelClass}>Even account</div>
				<p className="text-normal-body text-text">{evenName}</p>
				<p className="text-normal-body text-text-dim">{userDocument.providers.even?.uid || 'Not linked yet'}</p>
			</div>
		</Card>
	);
}
