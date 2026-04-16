import { smokeInputClass } from '../styles';

export function NumericField({ label, value, step = '1', onChange }: { label: string; value: number; step?: string; onChange: (value: number) => void }) {
	return (
		<label className="flex flex-col gap-2">
			<span className="text-detail uppercase tracking-[0.18em] text-text-dim">{label}</span>
			<input className={smokeInputClass} type="number" inputMode="decimal" step={step} value={Number.isFinite(value) ? value : 0} onChange={(event) => onChange(Number(event.currentTarget.value || 0))} />
		</label>
	);
}
