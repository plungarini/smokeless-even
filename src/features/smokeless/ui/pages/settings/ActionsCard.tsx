import { Button, Card } from 'even-toolkit/web';
import { glassCardClass, sectionLabelClass } from '../../styles';

interface Props {
	onExport: () => void;
	onSignOut: () => void;
	onDeleteAll: () => void;
	signOutLabel: string;
	signOutHint: string;
}

export function ActionsCard({ onExport, onSignOut, onDeleteAll, signOutLabel, signOutHint }: Props) {
	return (
		<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
			<div className="flex flex-col gap-4">
				<div className={sectionLabelClass}>Actions</div>
				<Button variant="secondary" className="rounded-[20px]" onClick={onExport}>
					Export JSON
				</Button>
				<div className="flex flex-col gap-1">
					<Button variant="secondary" className="rounded-[20px]" onClick={onSignOut}>
						{signOutLabel}
					</Button>
					<p className="px-1 text-[12px] leading-relaxed text-text-dim">{signOutHint}</p>
				</div>
				<Button variant="danger" className="rounded-[20px]" onClick={onDeleteAll}>
					Delete all data
				</Button>
			</div>
		</Card>
	);
}
