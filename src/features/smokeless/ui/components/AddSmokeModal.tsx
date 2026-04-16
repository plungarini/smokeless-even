import { Button } from 'even-toolkit/web';
import { circleIconButtonClass, smokeInputClass } from '../styles';

export function AddSmokeModal({
	open,
	date,
	time,
	mutating,
	onClose,
	onDateChange,
	onTimeChange,
	onSave,
}: {
	open: boolean;
	date: string;
	time: string;
	mutating: boolean;
	onClose: () => void;
	onDateChange: (value: string) => void;
	onTimeChange: (value: string) => void;
	onSave: () => void;
}) {
	return (
		<div
			className={[
				'fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 pt-10',
				'backdrop-blur-sm',
				'transition-[opacity,background-color] duration-300 ease-out',
				open ? 'bg-black/65 pointer-events-auto opacity-100' : 'pointer-events-none bg-black/0 opacity-0',
			].join(' ')}
			onClick={onClose}
		>
			<div
				className={[
					'smoke-modal-panel w-full max-w-md rounded-[32px] p-6',
					'transition-[opacity,transform] duration-300 ease-out',
					open ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
				].join(' ')}
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2 className="font-[DM_Serif_Display] text-[2.1rem] leading-none text-text">Add smoke</h2>
						<p className="mt-2 text-[15px] text-text-dim">Save a smoke for the selected day and time.</p>
					</div>
					<button type="button" className={circleIconButtonClass} onClick={onClose} aria-label="Close add smoke modal">
						×
					</button>
				</div>

				<div className="mt-6 flex flex-col gap-3">
					<label className="flex flex-col gap-2">
						<span className="text-detail uppercase tracking-[0.16em] text-text-dim">Date</span>
						<input
							className={smokeInputClass}
							type="date"
							value={date}
							onChange={(event) => onDateChange(event.currentTarget.value)}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-detail uppercase tracking-[0.16em] text-text-dim">Time</span>
						<input
							className={smokeInputClass}
							type="time"
							value={time}
							onChange={(event) => onTimeChange(event.currentTarget.value)}
						/>
					</label>
				</div>

				<div className="mt-6 flex gap-3">
					<Button variant="secondary" className="flex-1 rounded-[20px]" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="highlight" className="flex-1 rounded-[20px] !text-black" disabled={mutating} onClick={onSave}>
						Save smoke
					</Button>
				</div>
			</div>
		</div>
	);
}
