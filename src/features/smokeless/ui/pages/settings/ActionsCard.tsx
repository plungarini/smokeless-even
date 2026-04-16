import { Button, Card } from 'even-toolkit/web';
import { glassCardClass, sectionLabelClass } from '../../styles';

interface Props {
	onExport: () => void;
	onDeleteAll: () => void;
}

export function ActionsCard({ onExport, onDeleteAll }: Props) {
	return (
		<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
			<div className="flex flex-col gap-4">
				<div className={sectionLabelClass}>Actions</div>
				<Button variant="secondary" className="rounded-[20px]" onClick={onExport}>
					Export JSON
				</Button>
				<Button variant="danger" className="rounded-[20px]" onClick={onDeleteAll}>
					Delete all data
				</Button>
			</div>
		</Card>
	);
}
