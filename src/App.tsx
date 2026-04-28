import { Button, Card } from 'even-toolkit/web';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { appStore } from './app/store';
import { completeOnboarding, resetAuthMode, startBootstrap } from './app/bootstrap';
import { refreshLogs } from './app/refresh-logs';
import { useAppSelector } from './app/hooks/useAppSelector';
import { useClock } from './app/hooks/useClock';
import { useCountBump } from './app/hooks/useCountBump';
import { useSmokeActions } from './app/hooks/useSmokeActions';
import { useToast } from './app/hooks/useToast';
import { selectHudSnapshot } from './app/selectors';
import { formatShortDate, getHistoryEntriesForDay, monthStart } from './features/smokeless/lib/history-calendar';
import {
	buildStatsSeries,
	formatStatsIntervalLabel,
	getPeriodComparisonLabel,
	getSelectedPeriodAverageCigs,
	getSelectedPeriodTotal,
} from './features/smokeless/lib/stats-series';
import { computeWeightedIntervalForPeriod } from './domain/calculations';
import { AddSmokeModal } from './features/smokeless/ui/components/AddSmokeModal';
import { BottomTabBar } from './features/smokeless/ui/components/BottomTabBar';
import { FullScreenState } from './features/smokeless/ui/components/FullScreenState';
import { PageHeader } from './features/smokeless/ui/components/PageHeader';
import { HistoryPage } from './features/smokeless/ui/pages/HistoryPage';
import { HomePage } from './features/smokeless/ui/pages/HomePage';
import { OnboardingPage } from './features/smokeless/ui/pages/OnboardingPage';
import { SettingsPage } from './features/smokeless/ui/pages/settings/SettingsPage';
import { StatsPage } from './features/smokeless/ui/pages/StatsPage';
import type { StatsPeriod } from './features/smokeless/ui/types';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
	formatDurationClock,
	formatTimerClock,
	parseDayKey,
	toDateInputValue,
	toDayKey,
	toTimeInputValue,
} from './lib/time';

export default function App() {
	// Fire bootstrap exactly once per app lifetime.
	useEffect(() => {
		void startBootstrap();
	}, []);

	// ── Data from the store ───────────────────────────────────────────
	const phase = useAppSelector((s) => s.phase);
	const blockedMessage = useAppSelector((s) => s.statusMessage);
	const bootstrapErrorDetail = useAppSelector((s) => s.bootstrapErrorDetail);
	const canonicalUid = useAppSelector((s) => s.canonicalUid);
	const evenUser = useAppSelector((s) => s.evenUser);
	const accountInfo = useAppSelector((s) => s.accountInfo);
	const authMode = useAppSelector((s) => s.authMode);
	const userDocument = useAppSelector((s) => s.userDocument);
	const todayCount = useAppSelector((s) => s.todayCount);
	const allSmokeEntries = useAppSelector((s) => s.allSmokeEntries);
	const dailyStats = useAppSelector((s) => s.dailyStats);
	const monthlyStats = useAppSelector((s) => s.monthlyStats);
	const historyGroups = useAppSelector((s) => s.historyGroups);
	const historyHasMore = useAppSelector((s) => s.historyHasMore);
	const historyLoading = useAppSelector((s) => s.historyLoading);
	const tab = useAppSelector((s) => s.tab);
	const statsPeriod = useAppSelector((s) => s.statsPeriod);
	const selectedHistoryDay = useAppSelector((s) => s.selectedHistoryDay);
	const historyMonth = useAppSelector((s) => s.historyMonth);
	const mutating = useAppSelector((s) => s.mutating);
	const optimisticLastSmokeAt = useAppSelector((s) => s.optimisticLastSmokeAt);
	const lastSmokeAtState = useAppSelector((s) => s.lastSmokeAt);
	const hudSnapshot = useAppSelector(selectHudSnapshot);

	// ── On-demand stats/history fetching ──────────────────────────────
	// We no longer preload all logs on startup (that blocked the home
	// screen for seconds). Instead, fetch the full log history the first
	// time the user opens Stats or History.
	useEffect(() => {
		if (!canonicalUid) return;
		if (tab !== 'stats' && tab !== 'history') return;
		if (allSmokeEntries.length > 0) return;
		appStore.setHistoryLoading(true);
		void refreshLogs(canonicalUid).catch((error) => {
			console.error('[Smokeless] on-demand refreshLogs failed', error);
			appStore.setHistoryLoading(false);
		});
	}, [tab, canonicalUid, allSmokeEntries.length]);

	// ── Hooks that own their own React state ──────────────────────────
	const { toast, push: pushToast, dismiss: dismissToast } = useToast();
	const countBump = useCountBump(todayCount);
	const now = useClock();
	const smokeActions = useSmokeActions(pushToast);

	// ── Transient React-local state ───────────────────────────────────
	const [selectedStatsBucketKey, setSelectedStatsBucketKey] = useState<string | null>(null);
	const [historyModalOpen, setHistoryModalOpen] = useState(false);
	const [modalEntryDate, setModalEntryDate] = useState(() => toDateInputValue(new Date()));
	const [modalEntryTime, setModalEntryTime] = useState(() => toTimeInputValue(new Date()));

	// ── Derived display values ────────────────────────────────────────
	const lastSmokeAt = optimisticLastSmokeAt ?? lastSmokeAtState ?? allSmokeEntries[allSmokeEntries.length - 1]?.timestamp ?? null;
	const weightedAverage = hudSnapshot.home.weightedAverage;
	const statsSeries = useMemo(
		() => buildStatsSeries(statsPeriod, dailyStats, monthlyStats, now),
		[statsPeriod, dailyStats, monthlyStats, now],
	);
	const selectedPeriodTotal = getSelectedPeriodTotal(statsPeriod, dailyStats, monthlyStats, now);
	const comparisonLabel = getPeriodComparisonLabel(statsPeriod, selectedPeriodTotal, weightedAverage, now);
	const selectedStatsBucket = useMemo(
		() => (selectedStatsBucketKey ? (statsSeries.find((item) => item.key === selectedStatsBucketKey) ?? null) : null),
		[selectedStatsBucketKey, statsSeries],
	);
	const displayedStatsTotal = selectedStatsBucket?.count ?? selectedPeriodTotal;
	const statsAverageCigs = useMemo(
		() => getSelectedPeriodAverageCigs(statsPeriod, selectedPeriodTotal, now),
		[statsPeriod, selectedPeriodTotal, now],
	);
	const statsAverageIntervalLabel = useMemo(() => {
		const periodStart = statsSeries[0]?.start;
		const periodEnd = statsSeries[statsSeries.length - 1]?.end;
		const periodEntries =
			periodStart && periodEnd
				? allSmokeEntries.filter((e) => e.timestamp >= periodStart && e.timestamp <= periodEnd)
				: allSmokeEntries;
		return formatStatsIntervalLabel(computeWeightedIntervalForPeriod(periodEntries, now));
	}, [allSmokeEntries, statsSeries, now]);
	const statsTotalLabel = selectedStatsBucket
		? selectedStatsBucket.label
		: statsPeriod === 'week'
			? 'This week'
			: statsPeriod === 'month'
				? 'This month'
				: 'This year';
	const selectedHistoryEntries = getHistoryEntriesForDay(historyGroups, selectedHistoryDay);
	const historyDaysWithEntries = new Set(historyGroups.map((group) => group.dayKey));
	const timerLabel = formatTimerClock(lastSmokeAt, now);

	const timeSinceLastSmokeSeconds = lastSmokeAt
		? Math.max(0, Math.floor((now.getTime() - lastSmokeAt.getTime()) / 1000))
		: 0;
	const lastSmokeWasToday = lastSmokeAt ? toDayKey(lastSmokeAt) === toDayKey(now) : false;
	const longestEverCessationSeconds = Math.max(
		userDocument?.longestEverCessation ?? 0,
		timeSinceLastSmokeSeconds,
	);
	const todayLongestCessationSeconds = (() => {
		const metric = userDocument?.todayMaxCessation;
		const storedToday =
			metric?.lastUpdated && toDayKey(metric.lastUpdated) === toDayKey(now) ? metric.value : 0;
		if (!lastSmokeWasToday) return timeSinceLastSmokeSeconds;
		return Math.max(storedToday, timeSinceLastSmokeSeconds);
	})();
	const todayLongestCessationLabel = formatDurationClock(todayLongestCessationSeconds * 1000);
	const longestEverCessationLabel = formatDurationClock(longestEverCessationSeconds * 1000);

	// ── Settings-page derived values ──────────────────────────────────
	const effectiveGoogleEmail =
		evenUser && canonicalUid && userDocument
			? accountInfo?.googleEmail || userDocument.providers.google?.email
			: undefined;

	// ── Modal plumbing ────────────────────────────────────────────────
	const openHistoryModal = useCallback(() => {
		const baseDate = parseDayKey(selectedHistoryDay);
		setModalEntryDate(toDateInputValue(baseDate));
		setModalEntryTime(toTimeInputValue(new Date()));
		setHistoryModalOpen(true);
	}, [selectedHistoryDay]);

	const submitPastEntry = useCallback(async () => {
		const ok = await smokeActions.addPastEntry(modalEntryDate, modalEntryTime);
		if (ok) setHistoryModalOpen(false);
	}, [modalEntryDate, modalEntryTime, smokeActions]);

	return (
		<>
			{phase === 'booting' ? (
				<FullScreenState title="Smokeless" body="Connecting to Even and loading your smoking data." loading />
			) : phase === 'onboarding' ? (
				<OnboardingPage />
			) : phase === 'blocked' ? (
				<div className="mx-auto flex h-dvh items-center px-4 py-10">
					<Card padding="default" className="w-full rounded-[20px] border border-border-light bg-surface">
						<div className="flex flex-col gap-4">
							<h1 className="font-[DM_Serif_Display] text-4xl tracking-[-0.04em] text-text">Smokeless</h1>
							<p className="text-normal-body leading-relaxed text-text-dim">
								{blockedMessage || 'Smokeless could not finish startup. Please restart the app.'}
							</p>
							{bootstrapErrorDetail ? (
								<div className="rounded-[16px] border border-border-light bg-bg p-3">
									<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Debug</div>
									<p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-text-dim">
										{bootstrapErrorDetail}
									</p>
								</div>
							) : null}
							<div className="mt-2 flex flex-col gap-3">
								<Button
									variant="highlight"
									className="w-full rounded-[20px] !text-black"
									onClick={() => void resetAuthMode()}
								>
									Sign in again
								</Button>
								<Button
									variant="secondary"
									className="w-full rounded-[20px]"
									onClick={() => void completeOnboarding('local')}
								>
									Continue without account
								</Button>
							</div>
						</div>
					</Card>
				</div>
			) : !evenUser || !canonicalUid || !userDocument ? null : (
				<ErrorBoundary>
					<>
						<div className="smoke-app-shell h-dvh">
							<div className="smoke-app-ornament smoke-app-ornament-top" />
							<div className="smoke-app-ornament smoke-app-ornament-bottom" />

							<div className="relative flex h-full flex-col max-w-md mx-auto overflow-x-visible overflow-y-hidden">
								{tab === 'home' ? <PageHeader title="Today's record" subtitle={formatShortDate(now)} /> : null}
								{tab === 'stats' ? <PageHeader title="Stats" subtitle="Weighted view of your smoking trend" /> : null}
								{tab === 'history' ? <PageHeader title="History" subtitle="Select a date to view logs" /> : null}
								{tab === 'settings' ? <PageHeader title="Settings" subtitle="Account and app actions" /> : null}

								<div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible px-4 pb-32">
									{tab === 'home' ? (
										<HomePage
											todayCount={todayCount}
											todayLongestCessationLabel={todayLongestCessationLabel}
											longestEverCessationLabel={longestEverCessationLabel}
											timerLabel={timerLabel}
											countBump={countBump}
											mutating={mutating}
											onAddSmoke={() => void smokeActions.addSmoke()}
										/>
									) : null}

									{tab === 'stats' ? (
										<StatsPage
											statsPeriod={statsPeriod}
											onStatsPeriodChange={(period: StatsPeriod) => appStore.setStatsPeriod(period)}
											statsSeries={statsSeries}
											selectedStatsBucketKey={selectedStatsBucketKey}
											onStatsBucketSelect={(key) =>
												setSelectedStatsBucketKey((current) => (current === key ? null : key))
											}
											totalSmoked={displayedStatsTotal}
											totalLabel={statsTotalLabel}
											comparisonLabel={comparisonLabel}
											weightedAverage={statsAverageCigs}
											averageIntervalLabel={statsAverageIntervalLabel}
										/>
									) : null}

									{tab === 'history' ? (
										<HistoryPage
											historyMonth={historyMonth}
											selectedHistoryDay={selectedHistoryDay}
											historyDaysWithEntries={historyDaysWithEntries}
											selectedHistoryEntries={selectedHistoryEntries}
											historyLoading={historyLoading}
											historyHasMore={historyHasMore}
											onHistoryMonthChange={(date) => appStore.setHistoryMonth(date)}
											onHistoryDaySelect={(dayKey, date) => {
												appStore.setHistoryDay(dayKey);
												appStore.setHistoryMonth(monthStart(date));
											}}
											onOpenHistoryModal={openHistoryModal}
											onDeleteEntry={(entry) => void smokeActions.deleteEntry(entry)}
											onLoadMore={async () => false}
										/>
									) : null}

									{tab === 'settings' ? (
										<SettingsPage
											userDocument={userDocument}
											evenName={userDocument.providers.even?.name || evenUser.name}
											canonicalUid={canonicalUid}
											authMode={authMode}
											effectiveGoogleEmail={effectiveGoogleEmail}
											onExport={() => void smokeActions.exportLogs()}
											onSignOut={() => void resetAuthMode()}
											onDeleteAll={() => void smokeActions.deleteAll()}
										/>
									) : null}
								</div>

								<BottomTabBar
									activeTab={tab}
									onChange={(next) => {
										startTransition(() => {
											appStore.setTab(next);
										});
									}}
								/>
							</div>
						</div>

						<AddSmokeModal
							open={historyModalOpen}
							date={modalEntryDate}
							time={modalEntryTime}
							mutating={mutating}
							onClose={() => setHistoryModalOpen(false)}
							onDateChange={setModalEntryDate}
							onTimeChange={setModalEntryTime}
							onSave={() => void submitPastEntry()}
						/>

						{toast ? (
							<div className="pointer-events-none fixed bottom-28 left-4 right-4 z-[9999] flex justify-center">
								<button
									type="button"
									className="smokeless-toast pointer-events-auto w-full max-w-md text-left"
									onClick={dismissToast}
									aria-label="Dismiss notification"
								>
									<div className="smokeless-toast__message">{toast}</div>
								</button>
							</div>
						) : null}
					</>
				</ErrorBoundary>
			)}
		</>
	);
}
