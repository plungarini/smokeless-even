import { Card } from 'even-toolkit/web';
import { IcEditAdd } from 'even-toolkit/web/icons/svg-icons';
import { formatCurrency } from '../../../../lib/time';
import { glassCardClass, plusFabClass, sectionLabelClass } from '../styles';

export function HomePage({
	todayCount,
	longestCessationLabel,
	moneySaved,
	timerLabel,
	countBump,
	mutating,
	country,
	onAddSmoke,
}: {
	todayCount: number;
	longestCessationLabel: string;
	moneySaved: number;
	timerLabel: string;
	countBump: boolean;
	mutating: boolean;
	country: string;
	onAddSmoke: () => void;
}) {
	return (
		<div className="flex flex-col gap-4 pb-4">
			<Card padding="default" className={`${glassCardClass} rounded-[34px] px-6 py-6`}>
				<div className="flex flex-col gap-8">
					<div className="grid gap-6">
						<div>
							<div className="text-detail uppercase tracking-[0.38em] text-text-dim">Since last smoking</div>
							<div className="mt-3 text-[4rem] font-semibold leading-none tracking-[-0.04em] text-text">
								{timerLabel}
							</div>
						</div>
						<div>
							<div className="text-detail uppercase tracking-[0.38em] text-text-dim">Longest cessation</div>
							<div className="mt-3 text-[3.6rem] font-semibold leading-none tracking-[-0.04em] text-text">
								{longestCessationLabel}
							</div>
						</div>
						<div>
							<div className={sectionLabelClass}>Money saved</div>
							<div className="mt-3 text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-text">
								{formatCurrency(moneySaved, country)}
							</div>
						</div>
					</div>

					<div className="mt-2 flex items-end justify-between gap-4">
						<button
							type="button"
							className={plusFabClass}
							disabled={mutating}
							onClick={onAddSmoke}
							aria-label="Log smoke"
						>
							<IcEditAdd className="size-17 translate-y-0.75" />
						</button>
						<div className="text-right">
							<div className="text-detail uppercase tracking-[0.34em] text-text-dim">Smoked today</div>
							<div
								className={`mt-1 font-[DM_Serif_Display] text-[8.5rem] leading-[0.9] tracking-[-0.06em] text-text ${countBump ? 'ember-bump' : ''}`}
							>
								{todayCount}
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
