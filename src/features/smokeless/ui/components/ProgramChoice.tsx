import type { QuitProgram } from '../../../../domain/types';

export function ProgramChoice({ value, active, description, onSelect }: { value: QuitProgram; active: boolean; description: string; onSelect: (value: QuitProgram) => void }) {
	return (
		<button
			type="button"
			onClick={() => onSelect(value)}
			className={`rounded-[20px] border px-4 py-4 text-left transition ${active ? 'border-white/[0.18] bg-white/[0.08]' : 'border-white/[0.08] bg-white/[0.02]'}`}
		>
			<div className="font-[Barlow_Condensed] text-2xl uppercase tracking-[0.08em] text-text">{value}</div>
			<div className="mt-1 text-detail uppercase tracking-[0.16em] text-text-dim">{description}</div>
		</button>
	);
}
