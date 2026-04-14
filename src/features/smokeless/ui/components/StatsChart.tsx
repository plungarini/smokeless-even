export function StatsChart({ items }: { items: Array<{ key: string; label: string; count: number }> }) {
	const max = Math.max(...items.map((item) => item.count), 1);

	return (
		<div className="flex h-56 items-end gap-2 overflow-x-auto">
			{items.map((item) => {
				const height = `${Math.max(item.count === 0 ? 10 : 16, (item.count / max) * 100)}%`;
				return (
					<div key={item.key} className="flex min-w-9 flex-1 flex-col items-center gap-2">
						<div className={`w-full rounded-t-[14px] bg-white/[0.5] transition-all ${item.count === 0 ? 'ghost-bar' : ''}`} style={{ height }} />
						<div className="text-center text-[10px] uppercase tracking-[0.18em] text-text-dim">{item.label}</div>
					</div>
				);
			})}
		</div>
	);
}
