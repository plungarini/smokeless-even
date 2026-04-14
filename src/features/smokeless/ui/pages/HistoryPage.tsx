import { Button, Card, Loading } from 'even-toolkit/web';
import type { SmokeEntry } from '../../../../domain/types';
import { formatLongDate, formatTime, toDayKey } from '../../../../lib/time';
import { buildCalendarDays, formatIntervalShort, formatMonthHeading, shiftMonth } from '../../lib/history-calendar';
import { circleIconButtonClass, deleteButtonClass, floatingIconClass, glassCardClass } from '../styles';

export function HistoryPage({
	historyMonth,
	selectedHistoryDay,
	historyDaysWithEntries,
	selectedHistoryEntries,
	historyLoading,
	historyHasMore,
	onHistoryMonthChange,
	onHistoryDaySelect,
	onOpenHistoryModal,
	onDeleteEntry,
	onLoadMore,
}: {
	historyMonth: Date;
	selectedHistoryDay: string;
	historyDaysWithEntries: Set<string>;
	selectedHistoryEntries: SmokeEntry[];
	historyLoading: boolean;
	historyHasMore: boolean;
	onHistoryMonthChange: (nextMonth: Date) => void;
	onHistoryDaySelect: (dayKey: string, date: Date) => void;
	onOpenHistoryModal: () => void;
	onDeleteEntry: (entry: SmokeEntry) => void;
	onLoadMore: () => void;
}) {
	const calendarDays = buildCalendarDays(historyMonth);
	const selectedHistoryDate = new Date(`${selectedHistoryDay}T00:00:00`);

	return (
		<div className="flex flex-col gap-4 pb-4">
			<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
				<div className="flex items-center justify-between gap-3">
					<button type="button" className={circleIconButtonClass} onClick={() => onHistoryMonthChange(shiftMonth(historyMonth, -1))} aria-label="Previous month">
						‹
					</button>
					<div className="font-[DM_Serif_Display] text-[2rem] leading-none text-text">{formatMonthHeading(historyMonth)}</div>
					<button type="button" className={circleIconButtonClass} onClick={() => onHistoryMonthChange(shiftMonth(historyMonth, 1))} aria-label="Next month">
						›
					</button>
				</div>
				<div className="mt-5 grid grid-cols-7 gap-y-3 text-center text-[12px] uppercase tracking-[0.22em] text-text-dim">
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
						<div key={day}>{day}</div>
					))}
				</div>
				<div className="mt-4 grid grid-cols-7 gap-2">
					{calendarDays.map((date) => {
						const dayKey = toDayKey(date);
						const isSelected = dayKey === selectedHistoryDay;
						const isCurrentMonth = date.getMonth() === historyMonth.getMonth();
						const hasEntries = historyDaysWithEntries.has(dayKey);
						return (
							<button
								key={dayKey}
								type="button"
								className={`smoke-calendar-day ${isSelected ? 'is-selected' : ''} ${isCurrentMonth ? '' : 'is-muted'}`}
								onClick={() => onHistoryDaySelect(dayKey, new Date(date.getFullYear(), date.getMonth(), 1))}
							>
								<span>{date.getDate()}</span>
								{hasEntries ? <span className="smoke-calendar-dot" /> : null}
							</button>
						);
					})}
				</div>
			</Card>

			<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
				<div className="flex items-end justify-between gap-4">
					<div>
						<div className="font-[DM_Serif_Display] text-[2.1rem] leading-none text-text">{formatLongDate(selectedHistoryDate)}</div>
						<div className="mt-2 text-[15px] text-text-dim">{selectedHistoryEntries.length} logged smokes</div>
					</div>
					<button type="button" className={`${floatingIconClass} h-14 w-14`} onClick={onOpenHistoryModal} aria-label="Add smoke for selected day">
						<span className="text-[2rem] leading-none">+</span>
					</button>
				</div>

				<div className="mt-5 overflow-hidden rounded-[24px] border border-white/[0.06] bg-black/[0.12]">
					<div className="grid grid-cols-[56px_1fr_88px_58px] border-b border-white/[0.06] px-4 py-4 text-[12px] uppercase tracking-[0.2em] text-text-dim">
						<div>#</div>
						<div>Time</div>
						<div>Interval</div>
						<div />
					</div>
					{selectedHistoryEntries.length > 0 ? (
						selectedHistoryEntries.map((entry, index) => (
							<div key={entry.id} className="grid grid-cols-[56px_1fr_88px_58px] items-center border-b border-white/[0.05] px-4 py-4 last:border-b-0">
								<div className="text-[15px] text-text-dim">{selectedHistoryEntries.length - index}</div>
								<div className="text-[2rem] font-medium leading-none tracking-[-0.04em] text-text">{formatTime(entry.timestamp)}</div>
								<div className="text-[15px] text-text-dim">{formatIntervalShort(entry.timestamp, selectedHistoryEntries[index + 1]?.timestamp ?? null)}</div>
								<button type="button" className={deleteButtonClass} onClick={() => onDeleteEntry(entry)} aria-label={`Delete smoke at ${formatTime(entry.timestamp)}`}>
									×
								</button>
							</div>
						))
					) : (
						<div className="px-4 py-8 text-center text-[15px] text-text-dim">No smokes logged for this day yet.</div>
					)}
				</div>
			</Card>

			{historyLoading ? (
				<Card padding="default" className={`${glassCardClass} rounded-[28px]`}>
					<Loading size={18} />
				</Card>
			) : null}

			{historyHasMore ? (
				<Button variant="secondary" className="rounded-[20px]" disabled={historyLoading} onClick={onLoadMore}>
					Load more history
				</Button>
			) : null}
		</div>
	);
}
