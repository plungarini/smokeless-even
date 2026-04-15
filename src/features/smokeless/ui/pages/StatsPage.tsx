import { Badge, Card } from 'even-toolkit/web';
import type { StatsPeriod } from '../types';
import { STATS_PERIODS } from '../types';
import { glassCardClass, segmentedButtonActiveClass, segmentedButtonBaseClass } from '../styles';
import { StatsChart } from '../components/StatsChart';
import type { StatsSeriesItem } from '../../lib/stats-series';

export function StatsPage({
	statsPeriod,
	onStatsPeriodChange,
	statsSeries,
	selectedStatsBucketKey,
	onStatsBucketSelect,
	totalSmoked,
	totalLabel,
	comparisonLabel,
	weightedAverage,
	averageIntervalLabel,
}: {
	statsPeriod: StatsPeriod;
	onStatsPeriodChange: (period: StatsPeriod) => void;
	statsSeries: StatsSeriesItem[];
	selectedStatsBucketKey: string | null;
	onStatsBucketSelect: (key: string) => void;
	totalSmoked: number;
	totalLabel: string;
	comparisonLabel: string;
	weightedAverage: number;
	averageIntervalLabel: string;
}) {
	return (
		<div className="flex flex-col gap-4 pb-4">
			<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
				<div className="grid grid-cols-3 gap-1 rounded-full bg-white/[0.04] p-1.5">
					{STATS_PERIODS.map((period) => (
						<button
							key={period.id}
							type="button"
							onClick={() => onStatsPeriodChange(period.id)}
							className={`${segmentedButtonBaseClass} ${statsPeriod === period.id ? segmentedButtonActiveClass : ''}`}
						>
							{period.label}
						</button>
					))}
				</div>
			</Card>

			<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
				<div className="flex flex-col gap-5">
					<div className="flex items-end justify-between gap-4">
						<div>
							<div className="text-detail uppercase tracking-[0.32em] text-text-dim">{totalLabel}</div>
							<div className="mt-2 font-[DM_Serif_Display] text-[4.75rem] leading-none tracking-[-0.05em] text-text">{totalSmoked}</div>
						</div>
						<Badge variant={comparisonLabel.startsWith('-') ? 'accent' : 'negative'}>{comparisonLabel}</Badge>
					</div>
					<StatsChart items={statsSeries} selectedKey={selectedStatsBucketKey} onSelect={onStatsBucketSelect} />
				</div>
			</Card>

			<div className="grid grid-cols-2 gap-3">
				<Card padding="default" className={`${glassCardClass} rounded-[28px]`}>
					<div className="text-detail uppercase tracking-[0.22em] text-text-dim">Average cigs</div>
					<div className="mt-6 text-[3.5rem] font-semibold leading-none tracking-[-0.05em] text-text">{Math.round(weightedAverage)}</div>
					<div className="mt-3 text-[15px] text-text-dim">per day</div>
				</Card>
				<Card padding="default" className={`${glassCardClass} rounded-[28px]`}>
					<div className="text-detail uppercase tracking-[0.22em] text-text-dim">Average interval</div>
					<div className="mt-6 text-[3.5rem] font-semibold leading-none tracking-[-0.05em] text-text">{averageIntervalLabel}</div>
					<div className="mt-3 text-[15px] text-text-dim">weighted</div>
				</Card>
			</div>
		</div>
	);
}
