import { Button, Card } from 'even-toolkit/web';
import { useMemo, useRef, useState } from 'react';
import { clearDebugLogs, useDebugLogs, type DebugLogEntry } from '../../../../debug/logs';
import { glassCardClass, sectionLabelClass } from '../styles';

function formatLogDetails(details: unknown[] | undefined): string {
	if (!details?.length) {
		return '';
	}

	return details
		.map((detail, index) => {
			if (detail && typeof detail === 'object' && '_type' in detail) {
				const typedDetail = detail as { _type: string; [key: string]: unknown };
				if (typedDetail._type === 'Error') {
					return `[Error ${index + 1}] ${typedDetail.name ?? 'Error'}: ${typedDetail.message ?? ''}\n${typedDetail.stack ?? ''}`;
				}

				if (typedDetail._type === 'Response') {
					return `[Response ${index + 1}] ${typedDetail.status ?? ''} ${typedDetail.statusText ?? ''}\nURL: ${typedDetail.url ?? ''}`;
				}
			}

			try {
				return `[Arg ${index + 1}] ${JSON.stringify(detail, null, 2)}`;
			} catch {
				return `[Arg ${index + 1}] ${String(detail)}`;
			}
		})
		.join('\n\n');
}

function formatLogTime(ts: number): string {
	return new Date(ts).toLocaleTimeString([], { hour12: false });
}

function levelClasses(level: DebugLogEntry['level']): string {
	switch (level) {
		case 'error':
			return 'border-red-400/20 bg-red-500/[0.08] text-red-100';
		case 'warn':
			return 'border-amber-300/20 bg-amber-400/[0.08] text-amber-50';
		default:
			return 'border-white/[0.06] bg-black/[0.18] text-text';
	}
}

function levelLabel(level: DebugLogEntry['level']): string {
	switch (level) {
		case 'error':
			return 'ERROR';
		case 'warn':
			return 'WARN';
		default:
			return 'LOG';
	}
}

function createEntryKey(entry: DebugLogEntry, index: number): string {
	return `${entry.level}-${entry.ts}-${index}-${entry.msg}`;
}

type CopyStatus = 'idle' | 'copied' | 'failed';

export function DebugLogsCard() {
	const logs = useDebugLogs().filter((entry) => entry.level === 'warn' || entry.level === 'error');
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});
	const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
	const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const orderedLogs = useMemo(() => [...logs].reverse(), [logs]);

	const handleCopy = async () => {
		const text = orderedLogs
			.map((entry) => {
				const header = `[${formatLogTime(entry.ts)}] [${levelLabel(entry.level)}] ${entry.msg}`;
				const details = formatLogDetails(entry.details);
				return details ? `${header}\n${details}` : header;
			})
			.join('\n\n');

		if (!text) return;

		const finish = (status: CopyStatus) => {
			setCopyStatus(status);
			if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
			copyTimerRef.current = setTimeout(() => setCopyStatus('idle'), 1500);
		};

		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(text);
			} else {
				const textarea = document.createElement('textarea');
				textarea.value = text;
				textarea.style.position = 'fixed';
				textarea.style.opacity = '0';
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
			}
			finish('copied');
		} catch {
			finish('failed');
		}
	};

	const copyLabel = copyStatus === 'copied' ? 'Copied!' : copyStatus === 'failed' ? 'Failed' : 'Copy';

	return (
		<Card padding="default" className={`${glassCardClass} rounded-[32px]`}>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between gap-3">
					<div>
						<div className={sectionLabelClass}>Debug logs</div>
						<div className="mt-1 text-[13px] text-text-dim">
							{logs.length} warnings/errors · latest first · max 100
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							variant="secondary"
							className="rounded-[14px] px-3 py-2 text-[13px]"
							disabled={orderedLogs.length === 0}
							onClick={() => void handleCopy()}
						>
							{copyLabel}
						</Button>
						<Button
							variant="secondary"
							className="rounded-[14px] px-3 py-2 text-[13px]"
							disabled={orderedLogs.length === 0}
							onClick={() => {
								setExpanded({});
								clearDebugLogs();
							}}
						>
							Clear
						</Button>
					</div>
				</div>

				<div className="max-h-[300px] overflow-y-auto rounded-[20px] border border-white/[0.08] bg-black/[0.14] p-3">
					{orderedLogs.length ? (
						<div className="flex flex-col gap-2">
							{orderedLogs.map((entry, index) => {
								const entryKey = createEntryKey(entry, index);
								const isExpanded = expanded[entryKey] ?? false;
								const details = formatLogDetails(entry.details);
								const hasDetails = details.length > 0;

								return (
									<div key={entryKey} className={`rounded-[18px] border px-3 py-2 ${levelClasses(entry.level)}`}>
										<button
											type="button"
											className={`w-full text-left ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
											onClick={() => {
												if (!hasDetails) return;
												setExpanded((current) => ({ ...current, [entryKey]: !isExpanded }));
											}}
										>
											<div className="flex items-start gap-3">
												<div className="pt-[2px] text-[10px] uppercase tracking-[0.18em] text-text-dim">
													{levelLabel(entry.level)}
												</div>
												<div className="min-w-0 flex-1">
													<div className="break-all font-mono text-[12px] leading-relaxed text-current">
														{entry.msg}
													</div>
													<div className="mt-1 text-[11px] text-text-dim">{formatLogTime(entry.ts)}</div>
												</div>
												{hasDetails ? (
													<div className="pt-[2px] text-[10px] text-text-dim">{isExpanded ? 'HIDE' : 'MORE'}</div>
												) : null}
											</div>
										</button>
										{isExpanded ? (
											<pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[14px] border border-white/[0.06] bg-black/[0.24] p-3 text-[11px] leading-relaxed text-text-dim">
												{details}
											</pre>
										) : null}
									</div>
								);
							})}
						</div>
					) : (
						<div className="flex min-h-[140px] items-center justify-center rounded-[16px] border border-dashed border-white/[0.08] text-center text-[14px] text-text-dim">
							Log entries will appear here once Smokeless has something to report.
						</div>
					)}
				</div>
			</div>
		</Card>
	);
}
