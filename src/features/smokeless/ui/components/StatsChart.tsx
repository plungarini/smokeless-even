import type { StatsSeriesItem } from '../../lib/stats-series';

export function StatsChart({
	items,
	selectedKey,
	onSelect,
}: {
	items: StatsSeriesItem[];
	selectedKey: string | null;
	onSelect: (key: string) => void;
}) {
	const max = Math.max(...items.map((item) => item.count), 1);

	return (
		<div className="flex h-56 items-end gap-3 overflow-x-auto">
			{items.map((item) => {
				const fillHeight = `${Math.max(item.count === 0 ? 10 : 16, (item.count / max) * 100)}%`;
				const isSelected = item.key === selectedKey;
				return (
					<button
						key={item.key}
						type="button"
						onClick={() => onSelect(item.key)}
						className="flex min-w-9 flex-1 flex-col items-center gap-2 border-0 bg-transparent p-0 text-inherit"
						aria-pressed={isSelected}
						title={`${item.label}: ${item.count}`}
					>
						<div className="flex h-44 w-full items-end">
							<div className={`relative flex h-full w-full items-end overflow-hidden rounded-[14px] border transition-all ${isSelected ? 'border-white/[0.32] bg-white/[0.08]' : item.isCurrent ? 'border-white/[0.14] bg-white/[0.06]' : 'border-white/[0.06] bg-white/[0.04]'}`}>
								<div
									className={`w-full rounded-t-[14px] ${item.count === 0 ? 'ghost-bar bg-white/[0.24]' : isSelected ? 'bg-white/[0.92]' : item.isCurrent ? 'bg-white/[0.82]' : 'bg-white/[0.72]'} transition-all`}
									style={{ height: fillHeight }}
								/>
							</div>
						</div>
						<div className={`text-center text-[10px] uppercase tracking-[0.18em] ${isSelected || item.isCurrent ? 'text-text' : 'text-text-dim'}`}>{item.label}</div>
					</button>
				);
			})}
		</div>
	);
}
