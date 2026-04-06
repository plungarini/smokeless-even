import { AppShell, Badge, Button, Card, Loading, NavBar, ScreenHeader, SectionHeader, Toast } from 'even-toolkit/web';
import type { NavItem } from 'even-toolkit/web';
import { startTransition, useEffect, useEffectEvent, useRef, useState } from 'react';
import { waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { AppGlasses } from './glasses/AppGlasses';
import { setHudSnapshot } from './glasses/hud-store';
import { computeDailyTarget, computeMoneySaved, computeSleepAwareInterval, computeWeightedDailyAverage, getHealthMilestone } from './domain/calculations';
import type { EvenUserInfo, HistoryDayGroup, HudSnapshot, OnboardingDraft, QuitProgram, SmokeEntry, UserProfile } from './domain/types';
import { missingClientEnv } from './config/env';
import { normalizeEvenUserInfo } from './lib/even';
import { addDays, combineDateAndTime, currencyForCountry, formatCurrency, formatDayLabel, formatLongDate, formatMonthLabel, formatTime, formatTimerLabel, toDateInputValue, toDayKey, toMonthKey, toTimeInputValue } from './lib/time';
import { ensureFirebaseSession } from './services/auth';
import { addSmokeEntry, deleteAllUserData, exportSmokes, fetchDailyStats, fetchHistoryPage, fetchMonthlyStats, fetchRecentSmokes, fetchUserProfile, saveOnboarding, softDeleteSmokeEntry, subscribeToTodayCount, subscribeToUserProfile, type HistoryCursor, updateProgram, upsertEvenProfileFields } from './services/firestore';

type AppTab = 'home' | 'stats' | 'history' | 'program';
type StatsPeriod = 'day' | 'week' | 'month' | 'year';
type BootState = 'booting' | 'blocked' | 'ready';

const APP_TABS: NavItem[] = [
	{ id: 'home', label: 'Home' },
	{ id: 'stats', label: 'Stats' },
	{ id: 'history', label: 'History' },
	{ id: 'program', label: 'Program' },
];

const STATS_PERIODS: Array<{ id: StatsPeriod; label: string }> = [
	{ id: 'day', label: 'Day' },
	{ id: 'week', label: 'Week' },
	{ id: 'month', label: 'Month' },
	{ id: 'year', label: 'Year' },
];

function createDefaultOnboardingDraft(country: string): OnboardingDraft {
	void country;
	const defaultTargetDate = addDays(new Date(), 90);
	return {
		cigarettesPerDay: 20,
		packPrice: 10,
		cigarettesPerPack: 20,
		quitProgram: 'minimum',
		programTargetCigarettes: 0,
		programTargetDate: toDateInputValue(defaultTargetDate),
		step: 0,
	};
}

function loadSavedOnboarding(uid: string, country: string): OnboardingDraft {
	try {
		const raw = localStorage.getItem(`smokeless:onboarding:${uid}`);
		if (!raw) return createDefaultOnboardingDraft(country);
		const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
		return {
			...createDefaultOnboardingDraft(country),
			...parsed,
		};
	} catch {
		return createDefaultOnboardingDraft(country);
	}
}

function saveOnboardingDraft(uid: string, draft: OnboardingDraft): void {
	localStorage.setItem(`smokeless:onboarding:${uid}`, JSON.stringify(draft));
}

function clearOnboardingDraft(uid: string): void {
	localStorage.removeItem(`smokeless:onboarding:${uid}`);
}

function downloadJson(filename: string, payload: unknown): void {
	const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

function buildStatsSeries(period: StatsPeriod, dailyStats: Record<string, number>, monthlyStats: Record<string, number>, now: Date) {
	if (period === 'day') {
		return Array.from({ length: 14 }, (_, index) => {
			const date = addDays(now, -(13 - index));
			const key = toDayKey(date);
			return {
				key,
				label: formatDayLabel(date).split(' ')[0],
				count: dailyStats[key] ?? 0,
				date,
			};
		});
	}

	if (period === 'week') {
		return Array.from({ length: 8 }, (_, index) => {
			const weekEnd = addDays(now, -(7 * (7 - index)));
			const weekStart = addDays(weekEnd, -6);
			let count = 0;
			for (let cursor = 0; cursor < 7; cursor += 1) {
				const dayKey = toDayKey(addDays(weekStart, cursor));
				count += dailyStats[dayKey] ?? 0;
			}
			return {
				key: `${toDayKey(weekStart)}:${toDayKey(weekEnd)}`,
				label: `W${index + 1}`,
				count,
				date: weekEnd,
			};
		});
	}

	if (period === 'month') {
		const start = new Date(now.getFullYear(), now.getMonth(), 1);
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		return Array.from({ length: daysInMonth }, (_, index) => {
			const date = addDays(start, index);
			const key = toDayKey(date);
			return {
				key,
				label: String(date.getDate()),
				count: dailyStats[key] ?? 0,
				date,
			};
		});
	}

	return Array.from({ length: 12 }, (_, index) => {
		const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
		const key = toMonthKey(date);
		return {
			key,
			label: formatMonthLabel(date),
			count: monthlyStats[key] ?? 0,
			date,
		};
	});
}

function StatsChart({ items }: { items: Array<{ key: string; label: string; count: number }> }) {
	const max = Math.max(...items.map((item) => item.count), 1);

	return (
		<div className="flex h-48 items-end gap-2 overflow-x-auto">
			{items.map((item) => {
				const height = `${Math.max(item.count === 0 ? 10 : 16, (item.count / max) * 100)}%`;
				return (
					<div key={item.key} className="flex min-w-9 flex-1 flex-col items-center gap-2">
						<div
							className={`w-full rounded-t-[14px] bg-[var(--smoke-accent)] transition-all ${item.count === 0 ? 'ghost-bar' : ''}`}
							style={{ height }}
						/>
						<div className="text-center text-[10px] uppercase tracking-[0.18em] text-text-dim">{item.label}</div>
					</div>
				);
			})}
		</div>
	);
}

function FullScreenState({ title, body, loading = false }: { title: string; body: string; loading?: boolean }) {
	return (
		<div className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10">
			<Card padding="default" className="w-full rounded-[30px] border border-white/[0.06] bg-black/[0.25]">
				<div className="flex flex-col gap-4">
					{loading && (
						<div className="flex items-center gap-3">
							<Loading size={18} />
							<span className="text-detail uppercase tracking-[0.24em] text-text-dim">Starting Smokeless</span>
						</div>
					)}
					<h1 className="font-[Barlow_Condensed] text-5xl uppercase tracking-[0.08em] text-text">{title}</h1>
					<p className="text-normal-body leading-relaxed text-text-dim">{body}</p>
				</div>
			</Card>
		</div>
	);
}

function ProgramChoice({
	value,
	active,
	description,
	onSelect,
}: {
	value: QuitProgram;
	active: boolean;
	description: string;
	onSelect: (value: QuitProgram) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => onSelect(value)}
			className={`rounded-[20px] border px-4 py-4 text-left transition ${
				active ? 'border-[var(--smoke-accent)] bg-[color-mix(in_srgb,var(--smoke-accent)_18%,transparent)]' : 'border-white/[0.08] bg-white/[0.02]'
			}`}
		>
			<div className="font-[Barlow_Condensed] text-2xl uppercase tracking-[0.08em] text-text">{value}</div>
			<div className="mt-1 text-detail uppercase tracking-[0.16em] text-text-dim">{description}</div>
		</button>
	);
}

function NumericField({
	label,
	value,
	step = '1',
	onChange,
}: {
	label: string;
	value: number;
	step?: string;
	onChange: (value: number) => void;
}) {
	return (
		<label className="flex flex-col gap-2">
			<span className="text-detail uppercase tracking-[0.18em] text-text-dim">{label}</span>
			<input className="smoke-input" type="number" inputMode="decimal" step={step} value={Number.isFinite(value) ? value : 0} onChange={(event) => onChange(Number(event.currentTarget.value || 0))} />
		</label>
	);
}

function OnboardingFlow({
	country,
	draft,
	onChange,
	onSubmit,
}: {
	country: string;
	draft: OnboardingDraft;
	onChange: (next: OnboardingDraft) => void;
	onSubmit: () => Promise<void>;
}) {
	const currency = currencyForCountry(country);

	return (
		<div className="mx-auto max-w-md px-4 pb-10 pt-6">
			<ScreenHeader title="Smokeless" />
			<div className="mt-6 flex flex-col gap-4">
				<Card padding="default" className="rounded-[28px]">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-detail uppercase tracking-[0.22em] text-text-dim">Onboarding</div>
							<h2 className="font-[Barlow_Condensed] text-4xl uppercase tracking-[0.08em] text-text">Step {draft.step + 1} of 4</h2>
						</div>
						<Badge variant="accent">{currency}</Badge>
					</div>
				</Card>

				{draft.step === 0 && (
					<Card padding="default" className="rounded-[28px]">
						<div className="flex flex-col gap-4">
							<SectionHeader title="How many cigarettes do you smoke per day?" />
							<NumericField label="Daily baseline" value={draft.cigarettesPerDay} onChange={(value) => onChange({ ...draft, cigarettesPerDay: value })} />
						</div>
					</Card>
				)}

				{draft.step === 1 && (
					<Card padding="default" className="rounded-[28px]">
						<div className="flex flex-col gap-4">
							<SectionHeader title="What does a pack cost?" />
							<NumericField label={`Pack price (${currency})`} value={draft.packPrice} step="0.01" onChange={(value) => onChange({ ...draft, packPrice: value })} />
						</div>
					</Card>
				)}

				{draft.step === 2 && (
					<Card padding="default" className="rounded-[28px]">
						<div className="flex flex-col gap-4">
							<SectionHeader title="How many cigarettes are in a pack?" />
							<NumericField label="Cigarettes per pack" value={draft.cigarettesPerPack} onChange={(value) => onChange({ ...draft, cigarettesPerPack: value })} />
						</div>
					</Card>
				)}

				{draft.step === 3 && (
					<Card padding="default" className="rounded-[28px]">
						<div className="flex flex-col gap-4">
							<SectionHeader title="Set a quit program?" />
							<div className="grid gap-3">
								<ProgramChoice value="linear" active={draft.quitProgram === 'linear'} description="Gradual reduction toward a target date." onSelect={(quitProgram) => onChange({ ...draft, quitProgram })} />
								<ProgramChoice value="fixed" active={draft.quitProgram === 'fixed'} description="Keep a fixed daily cap." onSelect={(quitProgram) => onChange({ ...draft, quitProgram })} />
								<ProgramChoice value="minimum" active={draft.quitProgram === 'minimum'} description="Track only, no target." onSelect={(quitProgram) => onChange({ ...draft, quitProgram })} />
							</div>
							{draft.quitProgram !== 'minimum' && (
								<div className="grid gap-4 rounded-[22px] border border-white/[0.08] bg-white/[0.02] p-4">
									<NumericField label="Target cigarettes" value={draft.programTargetCigarettes} onChange={(value) => onChange({ ...draft, programTargetCigarettes: value })} />
									<label className="flex flex-col gap-2">
										<span className="text-detail uppercase tracking-[0.18em] text-text-dim">Target date</span>
										<input className="smoke-input" type="date" value={draft.programTargetDate} onChange={(event) => onChange({ ...draft, programTargetDate: event.currentTarget.value })} />
									</label>
								</div>
							)}
						</div>
					</Card>
				)}

				<div className="flex gap-3">
					<Button variant="secondary" className="flex-1" disabled={draft.step === 0} onClick={() => onChange({ ...draft, step: Math.max(0, draft.step - 1) })}>
						Back
					</Button>
					{draft.step < 3 ? (
						<Button variant="highlight" className="flex-1" onClick={() => onChange({ ...draft, step: Math.min(3, draft.step + 1) })}>
							Next
						</Button>
					) : (
						<Button variant="highlight" className="flex-1" onClick={() => void onSubmit()}>
							Start tracking
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export default function App() {
	const [bootState, setBootState] = useState<BootState>('booting');
	const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
	const [tab, setTab] = useState<AppTab>('home');
	const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('day');
	const [toast, setToast] = useState('');
	const [evenUser, setEvenUser] = useState<EvenUserInfo | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft>(createDefaultOnboardingDraft('US'));
	const [todayCount, setTodayCount] = useState(0);
	const [dailyStats, setDailyStats] = useState<Record<string, number>>({});
	const [monthlyStats, setMonthlyStats] = useState<Record<string, number>>({});
	const [recentSmokes, setRecentSmokes] = useState<SmokeEntry[]>([]);
	const [historyGroups, setHistoryGroups] = useState<HistoryDayGroup[]>([]);
	const [historyCursor, setHistoryCursor] = useState<HistoryCursor>(null);
	const [historyHasMore, setHistoryHasMore] = useState(false);
	const [historyLoading, setHistoryLoading] = useState(false);
	const [mutating, setMutating] = useState(false);
	const [editingOnboarding, setEditingOnboarding] = useState(false);
	const [pastEntryDate, setPastEntryDate] = useState(() => toDateInputValue(new Date()));
	const [pastEntryTime, setPastEntryTime] = useState(() => toTimeInputValue(new Date()));
	const [clock, setClock] = useState(() => Date.now());
	const [countBump, setCountBump] = useState(false);
	const previousTodayCountRef = useRef(0);
	const unsubscribeRef = useRef<(() => void)[]>([]);

	useEffect(() => {
		const timer = setInterval(() => setClock(Date.now()), 60_000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (todayCount !== previousTodayCountRef.current) {
			previousTodayCountRef.current = todayCount;
			setCountBump(true);
			const timer = setTimeout(() => setCountBump(false), 220);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [todayCount]);

	const now = new Date(clock);
	const weightedAverage = computeWeightedDailyAverage(dailyStats, userProfile?.createdAt ?? null, now);
	const dailyTarget = computeDailyTarget(userProfile, now);
	const moneySaved = computeMoneySaved(userProfile, weightedAverage, now);
	const averageInterval = computeSleepAwareInterval(recentSmokes, now);
	const healthMilestone = getHealthMilestone(userProfile?.lastSmokeTimestamp ?? userProfile?.createdAt ?? null, now);
	const overTarget = dailyTarget !== null && todayCount > dailyTarget;
	const statsSeries = buildStatsSeries(statsPeriod, dailyStats, monthlyStats, now);

	const hudSnapshot: HudSnapshot = {
		todayCount,
		lastSmokeAt: userProfile?.lastSmokeTimestamp ?? null,
		dailyTarget,
		weightedAverage,
		blockedMessage: bootState === 'blocked' ? blockedMessage : null,
	};

	useEffect(() => {
		setHudSnapshot(hudSnapshot);
	}, [hudSnapshot]);

	useEffect(() => {
		if (evenUser && !userProfile) {
			saveOnboardingDraft(evenUser.uid, onboardingDraft);
		}
	}, [evenUser, onboardingDraft, userProfile]);

	useEffect(() => {
		if (!userProfile) return;
		setOnboardingDraft({
			cigarettesPerDay: userProfile.cigarettesPerDay,
			packPrice: userProfile.packPrice,
			cigarettesPerPack: userProfile.cigarettesPerPack,
			quitProgram: userProfile.quitProgram,
			programTargetCigarettes: userProfile.programTargetCigarettes,
			programTargetDate: userProfile.programTargetDate ? toDateInputValue(userProfile.programTargetDate) : toDateInputValue(addDays(new Date(), 90)),
			step: 0,
		});
	}, [userProfile]);

	useEffect(() => {
		return () => {
			for (const unsubscribe of unsubscribeRef.current) {
				unsubscribe();
			}
		};
	}, []);

	const pushToast = useEffectEvent((message: string) => {
		setToast(message);
		window.setTimeout(() => {
			setToast((current) => (current === message ? '' : current));
		}, 2400);
	});

	const refreshDerivedData = useEffectEvent(async (uid: string, includeHistory = false) => {
		const [daily, monthly, smokes] = await Promise.all([
			fetchDailyStats(uid),
			fetchMonthlyStats(uid),
			fetchRecentSmokes(uid),
		]);

		startTransition(() => {
			setDailyStats(daily);
			setMonthlyStats(monthly);
			setRecentSmokes(smokes);
			setTodayCount(daily[toDayKey(new Date())] ?? 0);
		});

		if (includeHistory) {
			setHistoryLoading(true);
			try {
				const history = await fetchHistoryPage(uid, null);
				startTransition(() => {
					setHistoryGroups(history.groups);
					setHistoryCursor(history.cursor);
					setHistoryHasMore(history.hasMore);
				});
			} finally {
				setHistoryLoading(false);
			}
		}
	});

	const bootstrap = useEffectEvent(async () => {
		if (missingClientEnv.length > 0) {
			setBlockedMessage(`Missing web config: ${missingClientEnv.join(', ')}`);
			setBootState('blocked');
			return;
		}

		try {
			const bridge = await waitForEvenAppBridge();
			const rawUser = await bridge.getUserInfo?.();
			const normalized = normalizeEvenUserInfo(rawUser);

			if (!normalized) {
				setBlockedMessage('Unable to connect to your Even account. Please restart the app.');
				setBootState('blocked');
				return;
			}

			setEvenUser(normalized);
			setOnboardingDraft(loadSavedOnboarding(normalized.uid, normalized.country));
			await ensureFirebaseSession(normalized);

			const profile = await fetchUserProfile(normalized.uid);
			if (profile) {
				await upsertEvenProfileFields(normalized.uid, normalized);
			}

			const unsubscribes = [
				subscribeToUserProfile(normalized.uid, (nextProfile) => {
					startTransition(() => {
						setUserProfile(nextProfile);
						if (!nextProfile) {
							setOnboardingDraft(loadSavedOnboarding(normalized.uid, normalized.country));
						}
					});
				}),
				subscribeToTodayCount(normalized.uid, (count) => {
					startTransition(() => setTodayCount(count));
				}),
			];

			unsubscribeRef.current = unsubscribes;
			await refreshDerivedData(normalized.uid, true);
			setBootState('ready');
		} catch (error) {
			console.error('[Smokeless] bootstrap failed', error);
			setBlockedMessage('Unable to connect to your Even account. Please restart the app.');
			setBootState('blocked');
		}
	});

	useEffect(() => {
		void bootstrap();
	}, [bootstrap]);

	const handleOnboardingSubmit = useEffectEvent(async () => {
		if (!evenUser) return;
		setMutating(true);
		try {
			await saveOnboarding(evenUser.uid, evenUser, onboardingDraft);
			clearOnboardingDraft(evenUser.uid);
			setEditingOnboarding(false);
			await refreshDerivedData(evenUser.uid, true);
			pushToast('Onboarding saved');
		} finally {
			setMutating(false);
		}
	});

	const handleAddSmoke = useEffectEvent(async () => {
		if (!evenUser || !userProfile || mutating) return false;

		const snapshot = {
			todayCount,
			lastSmokeTimestamp: userProfile.lastSmokeTimestamp,
		};

		const optimisticNow = new Date();
		setMutating(true);
		startTransition(() => {
			setTodayCount(snapshot.todayCount + 1);
			setUserProfile({
				...userProfile,
				lastSmokeTimestamp: optimisticNow,
			});
		});

		try {
			await addSmokeEntry(evenUser.uid, optimisticNow);
			await refreshDerivedData(evenUser.uid, tab === 'history');
			return true;
		} catch (error) {
			console.error('[Smokeless] add smoke failed', error);
			startTransition(() => {
				setTodayCount(snapshot.todayCount);
				setUserProfile({
					...userProfile,
					lastSmokeTimestamp: snapshot.lastSmokeTimestamp,
				});
			});
			pushToast('Could not log smoke');
			return false;
		} finally {
			setMutating(false);
		}
	});

	const handleAddPastEntry = useEffectEvent(async () => {
		if (!evenUser) return;
		setMutating(true);
		try {
			await addSmokeEntry(evenUser.uid, combineDateAndTime(pastEntryDate, pastEntryTime));
			await refreshDerivedData(evenUser.uid, true);
			pushToast('Past smoke added');
		} catch (error) {
			console.error('[Smokeless] add past entry failed', error);
			pushToast('Could not add past entry');
		} finally {
			setMutating(false);
		}
	});

	const handleDeleteEntry = useEffectEvent(async (entry: SmokeEntry) => {
		if (!evenUser) return;
		if (!window.confirm(`Soft delete the smoke logged at ${formatTime(entry.timestamp)}?`)) {
			return;
		}
		setMutating(true);
		try {
			await softDeleteSmokeEntry(evenUser.uid, entry.id);
			await refreshDerivedData(evenUser.uid, true);
			pushToast('Entry deleted');
		} catch (error) {
			console.error('[Smokeless] delete smoke failed', error);
			pushToast('Could not delete entry');
		} finally {
			setMutating(false);
		}
	});

	const handleLoadMoreHistory = useEffectEvent(async () => {
		if (!evenUser || !historyHasMore || historyLoading) return;
		setHistoryLoading(true);
		try {
			const page = await fetchHistoryPage(evenUser.uid, historyCursor);
			startTransition(() => {
				setHistoryGroups((current) => [...current, ...page.groups]);
				setHistoryCursor(page.cursor);
				setHistoryHasMore(page.hasMore);
			});
		} finally {
			setHistoryLoading(false);
		}
	});

	const handleProgramSave = useEffectEvent(async () => {
		if (!evenUser || !userProfile) return;
		setMutating(true);
		try {
			await updateProgram(evenUser.uid, {
				cigarettesPerDay: onboardingDraft.cigarettesPerDay,
				packPrice: onboardingDraft.packPrice,
				cigarettesPerPack: onboardingDraft.cigarettesPerPack,
				quitProgram: onboardingDraft.quitProgram,
				programTargetCigarettes: onboardingDraft.quitProgram === 'minimum' ? 0 : onboardingDraft.programTargetCigarettes,
				programTargetDate:
					onboardingDraft.quitProgram === 'minimum' || !onboardingDraft.programTargetDate
						? null
						: new Date(`${onboardingDraft.programTargetDate}T00:00:00`),
				programStartDate: new Date(),
			});
			await refreshDerivedData(evenUser.uid, false);
			pushToast('Program saved');
		} finally {
			setMutating(false);
		}
	});

	const handleResetOnboarding = useEffectEvent(() => {
		if (!userProfile || !evenUser) return;
		const nextDraft: OnboardingDraft = {
			cigarettesPerDay: userProfile.cigarettesPerDay,
			packPrice: userProfile.packPrice,
			cigarettesPerPack: userProfile.cigarettesPerPack,
			quitProgram: userProfile.quitProgram,
			programTargetCigarettes: userProfile.programTargetCigarettes,
			programTargetDate: userProfile.programTargetDate ? toDateInputValue(userProfile.programTargetDate) : toDateInputValue(addDays(new Date(), 90)),
			step: 0,
		};
		setOnboardingDraft(nextDraft);
		setEditingOnboarding(true);
		saveOnboardingDraft(evenUser.uid, nextDraft);
		pushToast('Onboarding reopened');
	});

	const handleExport = useEffectEvent(async () => {
		if (!evenUser) return;
		const payload = await exportSmokes(evenUser.uid);
		downloadJson(`smokeless-export-${toDayKey(new Date())}.json`, payload);
		pushToast('Export ready');
	});

	const handleDeleteAll = useEffectEvent(async () => {
		if (!evenUser) return;
		if (!window.confirm('Delete all Smokeless data?')) return;
		if (!window.confirm('This removes smoke history, stats, and onboarding data. Continue?')) return;
		setMutating(true);
		try {
			await deleteAllUserData(evenUser.uid);
			clearOnboardingDraft(evenUser.uid);
			setDailyStats({});
			setMonthlyStats({});
			setRecentSmokes([]);
			setHistoryGroups([]);
			setHistoryCursor(null);
			setHistoryHasMore(false);
			pushToast('All data deleted');
		} finally {
			setMutating(false);
		}
	});

	const currentCurrency = currencyForCountry(userProfile?.evenCountry || evenUser?.country || 'US');

	if (bootState === 'booting') {
		return (
			<>
				<AppGlasses snapshot={hudSnapshot} onConfirmSmoke={handleAddSmoke} />
				<FullScreenState title="Smokeless" body="Connecting to Even and loading your smoking data." loading />
			</>
		);
	}

	if (bootState === 'blocked') {
		return (
			<>
				<AppGlasses snapshot={hudSnapshot} onConfirmSmoke={handleAddSmoke} />
				<FullScreenState title="Account Blocked" body={blockedMessage || 'Unable to connect to your Even account. Please restart the app.'} />
			</>
		);
	}

	if (!evenUser) {
		return null;
	}

	if (!userProfile || editingOnboarding) {
		return (
			<>
				<AppGlasses snapshot={hudSnapshot} onConfirmSmoke={handleAddSmoke} />
				<OnboardingFlow country={evenUser.country} draft={onboardingDraft} onChange={setOnboardingDraft} onSubmit={handleOnboardingSubmit} />
			</>
		);
	}

	return (
		<>
			<AppGlasses snapshot={hudSnapshot} onConfirmSmoke={handleAddSmoke} />
			<AppShell header={<NavBar items={APP_TABS} activeId={tab} onNavigate={(next) => startTransition(() => setTab(next as AppTab))} />} className="mx-auto max-w-md">
				<div className="px-4 pb-10 pt-6">
					<ScreenHeader title="Smokeless" />
					<p className="mt-2 text-normal-body text-text-dim">Weighted averages ignore zero-smoke days and push recent days to the front.</p>

					{tab === 'home' && (
						<div className="mt-6 flex flex-col gap-4">
							<Card
								padding="default"
								className={`rounded-[32px] border ${overTarget ? 'border-[var(--smoke-danger)]' : 'border-white/[0.06]'} ${overTarget ? 'bg-[color-mix(in_srgb,var(--smoke-danger)_14%,transparent)]' : ''}`}
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<div className="text-detail uppercase tracking-[0.24em] text-text-dim">Today</div>
										<div className={`font-[Barlow_Condensed] text-[6rem] leading-none tracking-[0.04em] text-text ${countBump ? 'ember-bump' : ''}`}>{todayCount}</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<Badge variant={overTarget ? 'neutral' : 'accent'}>{dailyTarget === null ? 'Tracking only' : `Target ${dailyTarget}`}</Badge>
										<span className="text-detail uppercase tracking-[0.18em] text-text-dim">{currentCurrency}</span>
									</div>
								</div>
							</Card>

							<Card padding="default" className="rounded-[28px]">
								<div className="grid gap-4">
									<div>
										<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Timer</div>
										<div className="mt-1 font-[Barlow_Condensed] text-4xl uppercase tracking-[0.06em] text-text">{formatTimerLabel(userProfile.lastSmokeTimestamp, now)}</div>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-4">
											<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Money saved</div>
											<div className="mt-2 text-large-title text-text">{formatCurrency(moneySaved, userProfile.evenCountry || evenUser.country)}</div>
										</div>
										<div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-4">
											<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Weighted avg</div>
											<div className="mt-2 text-large-title text-text">{weightedAverage.toFixed(1)}/day</div>
										</div>
									</div>
								</div>
							</Card>

							<Card padding="default" className="rounded-[28px]">
								<div className="flex flex-col gap-3">
									<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Health timeline</div>
									<p className="text-normal-body leading-relaxed text-text">{healthMilestone}</p>
									<p className="text-normal-body text-text-dim">
										Average interval: {averageInterval ? `${Math.round(averageInterval)} min` : 'Need more history'}
									</p>
								</div>
							</Card>

							<Button variant="highlight" className="h-14 rounded-[20px]" disabled={mutating} onClick={() => void handleAddSmoke()}>
								Add smoke
							</Button>
						</div>
					)}

					{tab === 'stats' && (
						<div className="mt-6 flex flex-col gap-4">
							<Card padding="default" className="rounded-[28px]">
								<div className="flex flex-wrap gap-2">
									{STATS_PERIODS.map((period) => (
										<Button
											key={period.id}
											variant={statsPeriod === period.id ? 'highlight' : 'secondary'}
											size="sm"
											onClick={() => setStatsPeriod(period.id)}
										>
											{period.label}
										</Button>
									))}
								</div>
							</Card>

							<Card padding="default" className="rounded-[28px]">
								<div className="flex flex-col gap-4">
									<SectionHeader title="Weighted avg / active days only" />
									<StatsChart items={statsSeries} />
								</div>
							</Card>

							<Card padding="default" className="rounded-[28px]">
								<div className="grid grid-cols-2 gap-3">
									<div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-4">
										<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Weighted avg</div>
										<div className="mt-2 text-large-title text-text">{weightedAverage.toFixed(1)}/day</div>
									</div>
									<div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-4">
										<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Today</div>
										<div className="mt-2 text-large-title text-text">{todayCount}</div>
									</div>
								</div>
								<p className="mt-4 text-normal-body text-text-dim">
									Zero-smoke days stay visible in the chart as ghost bars but are excluded from the weighted average below.
								</p>
							</Card>
						</div>
					)}

					{tab === 'history' && (
						<div className="mt-6 flex flex-col gap-4">
							<Card padding="default" className="rounded-[28px]">
								<div className="grid gap-4">
									<SectionHeader title="Add past entry" />
									<div className="grid grid-cols-2 gap-3">
										<label className="flex flex-col gap-2">
											<span className="text-detail uppercase tracking-[0.18em] text-text-dim">Date</span>
											<input className="smoke-input" type="date" value={pastEntryDate} onChange={(event) => setPastEntryDate(event.currentTarget.value)} />
										</label>
										<label className="flex flex-col gap-2">
											<span className="text-detail uppercase tracking-[0.18em] text-text-dim">Time</span>
											<input className="smoke-input" type="time" value={pastEntryTime} onChange={(event) => setPastEntryTime(event.currentTarget.value)} />
										</label>
									</div>
									<Button variant="secondary" className="rounded-[18px]" disabled={mutating} onClick={() => void handleAddPastEntry()}>
										Add timestamped smoke
									</Button>
								</div>
							</Card>

							{historyGroups.map((group) => (
								<Card key={group.dayKey} padding="default" className="rounded-[28px]">
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between">
											<div>
												<div className="font-[Barlow_Condensed] text-3xl uppercase tracking-[0.08em] text-text">{formatLongDate(group.date)}</div>
												<div className="text-detail uppercase tracking-[0.16em] text-text-dim">{group.count} smokes</div>
											</div>
											<Badge variant="neutral">{group.dayKey}</Badge>
										</div>
										<div className="flex flex-wrap gap-2">
											{group.entries.map((entry) => (
												<button
													key={entry.id}
												type="button"
												onClick={() => void handleDeleteEntry(entry)}
												className="rounded-full border border-white/[0.08] px-3 py-2 text-detail uppercase tracking-[0.14em] text-text-dim transition hover:border-[var(--smoke-danger)] hover:text-text"
											>
													{formatTime(entry.timestamp)}
												</button>
											))}
										</div>
									</div>
								</Card>
							))}

							{historyLoading && <Card padding="default" className="rounded-[28px]"><Loading size={18} /></Card>}

							{historyHasMore && (
								<Button variant="secondary" className="rounded-[20px]" disabled={historyLoading} onClick={() => void handleLoadMoreHistory()}>
									Load 30 more days
								</Button>
							)}
						</div>
					)}

					{tab === 'program' && (
						<div className="mt-6 flex flex-col gap-4">
							<Card padding="default" className="rounded-[28px]">
								<div className="grid gap-4">
									<SectionHeader title="Program" />
									<div className="grid gap-3">
										<ProgramChoice value="linear" active={onboardingDraft.quitProgram === 'linear'} description="Gradual reduction toward a date." onSelect={(quitProgram) => setOnboardingDraft((current) => ({ ...current, quitProgram }))} />
										<ProgramChoice value="fixed" active={onboardingDraft.quitProgram === 'fixed'} description="Same cap every day." onSelect={(quitProgram) => setOnboardingDraft((current) => ({ ...current, quitProgram }))} />
										<ProgramChoice value="minimum" active={onboardingDraft.quitProgram === 'minimum'} description="Track without a limit." onSelect={(quitProgram) => setOnboardingDraft((current) => ({ ...current, quitProgram }))} />
									</div>
									<NumericField label="Baseline cigarettes/day" value={onboardingDraft.cigarettesPerDay} onChange={(value) => setOnboardingDraft((current) => ({ ...current, cigarettesPerDay: value }))} />
									<NumericField label={`Pack price (${currentCurrency})`} value={onboardingDraft.packPrice} step="0.01" onChange={(value) => setOnboardingDraft((current) => ({ ...current, packPrice: value }))} />
									<NumericField label="Cigarettes per pack" value={onboardingDraft.cigarettesPerPack} onChange={(value) => setOnboardingDraft((current) => ({ ...current, cigarettesPerPack: value }))} />
									{onboardingDraft.quitProgram !== 'minimum' && (
										<>
											<NumericField label="Target cigarettes" value={onboardingDraft.programTargetCigarettes} onChange={(value) => setOnboardingDraft((current) => ({ ...current, programTargetCigarettes: value }))} />
											<label className="flex flex-col gap-2">
												<span className="text-detail uppercase tracking-[0.18em] text-text-dim">Target date</span>
												<input className="smoke-input" type="date" value={onboardingDraft.programTargetDate} onChange={(event) => setOnboardingDraft((current) => ({ ...current, programTargetDate: event.currentTarget.value }))} />
											</label>
										</>
									)}
									<Button variant="highlight" className="rounded-[18px]" disabled={mutating} onClick={() => void handleProgramSave()}>
										Save program
									</Button>
								</div>
							</Card>

							<Card padding="default" className="rounded-[28px]">
								<div className="flex flex-col gap-3">
									<SectionHeader title="Even account" />
									<p className="text-normal-body text-text">{userProfile.evenName || evenUser.name}</p>
									<p className="text-normal-body text-text-dim">{userProfile.evenUid}</p>
									<p className="text-normal-body text-text-dim">{userProfile.evenCountry || evenUser.country}</p>
								</div>
							</Card>

							<Card padding="default" className="rounded-[28px]">
								<div className="flex flex-col gap-3">
									<SectionHeader title="Actions" />
									<Button variant="secondary" className="rounded-[18px]" onClick={handleResetOnboarding}>
										Onboarding reset
									</Button>
									<Button variant="secondary" className="rounded-[18px]" onClick={() => void handleExport()}>
										Export JSON
									</Button>
									<Button variant="danger" className="rounded-[18px]" onClick={() => void handleDeleteAll()}>
										Delete all data
									</Button>
								</div>
							</Card>
						</div>
					)}
				</div>
			</AppShell>

			{toast && (
				<div className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md">
					<Toast message={toast} />
				</div>
			)}
		</>
	);
}
