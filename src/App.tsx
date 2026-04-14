import { Card, Toast } from 'even-toolkit/web';
import { startTransition, useEffect, useEffectEvent, useRef, useState } from 'react';
import { EvenAppMethod, waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { AppGlasses } from './glasses/AppGlasses';
import { setHudSnapshot } from './glasses/hud-store';
import { computeDailyTarget, computeLongestCessation, computeMoneySaved, computeSleepAwareInterval, computeWeightedDailyAverage } from './domain/calculations';
import type { AuthAccountInfo, EvenUserInfo, HistoryDayGroup, HudSnapshot, OnboardingDraft, SmokeEntry, UserProfile } from './domain/types';
import { missingClientEnv } from './config/env';
import { normalizeEvenUserInfo } from './lib/even';
import { addDays, combineDateAndTime, currencyForCountry, formatDurationClock, formatTime, formatTimerClock, parseDayKey, toDateInputValue, toDayKey, toTimeInputValue } from './lib/time';
import { ensureFirebaseSession, getCurrentAccountInfo, resolveGoogleLinkRedirect, startGoogleLinkRedirect } from './services/auth';
import { addSmokeEntry, deleteAllUserData, ensureCanonicalUserData, exportSmokes, fetchAllSmokeEntries, fetchDailyStats, fetchHistoryPage, fetchMonthlyStats, mergeUserData, saveOnboarding, softDeleteSmokeEntry, subscribeToTodayCount, subscribeToUserProfile, type HistoryCursor, updateProgram, upsertAuthProviderFields } from './services/firestore';
import { buildStatsSeries, getPeriodComparisonLabel, getSelectedPeriodTotal } from './features/smokeless/lib/stats-series';
import { clearOnboardingDraft, createDefaultOnboardingDraft, loadSavedOnboarding, moveOnboardingDraft, saveOnboardingDraft } from './features/smokeless/lib/onboarding-draft';
import { formatShortDate, getHistoryEntriesForDay, monthStart } from './features/smokeless/lib/history-calendar';
import type { AppTab, StatsPeriod } from './features/smokeless/ui/types';
import { AddSmokeModal } from './features/smokeless/ui/components/AddSmokeModal';
import { BottomTabBar } from './features/smokeless/ui/components/BottomTabBar';
import { FullScreenState } from './features/smokeless/ui/components/FullScreenState';
import { PageHeader } from './features/smokeless/ui/components/PageHeader';
import { HistoryPage } from './features/smokeless/ui/pages/HistoryPage';
import { HomePage } from './features/smokeless/ui/pages/HomePage';
import { OnboardingFlow } from './features/smokeless/ui/pages/OnboardingFlow';
import { SettingsPage } from './features/smokeless/ui/pages/SettingsPage';
import { StatsPage } from './features/smokeless/ui/pages/StatsPage';

type BootState = 'booting' | 'blocked' | 'ready';

function downloadJson(filename: string, payload: unknown): void {
	const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

export default function App() {
	const [bootState, setBootState] = useState<BootState>('booting');
	const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
	const [bootstrapErrorDetail, setBootstrapErrorDetail] = useState<string | null>(null);
	const [canonicalUid, setCanonicalUid] = useState<string | null>(null);
	const [tab, setTab] = useState<AppTab>('home');
	const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('week');
	const [toast, setToast] = useState('');
	const [evenUser, setEvenUser] = useState<EvenUserInfo | null>(null);
	const [accountInfo, setAccountInfo] = useState<AuthAccountInfo | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft>(createDefaultOnboardingDraft('US'));
	const [todayCount, setTodayCount] = useState(0);
	const [dailyStats, setDailyStats] = useState<Record<string, number>>({});
	const [monthlyStats, setMonthlyStats] = useState<Record<string, number>>({});
	const [historyGroups, setHistoryGroups] = useState<HistoryDayGroup[]>([]);
	const [historyCursor, setHistoryCursor] = useState<HistoryCursor>(null);
	const [historyHasMore, setHistoryHasMore] = useState(false);
	const [historyLoading, setHistoryLoading] = useState(false);
	const [mutating, setMutating] = useState(false);
	const [editingOnboarding, setEditingOnboarding] = useState(false);
	const [historyMonth, setHistoryMonth] = useState(() => monthStart(new Date()));
	const [selectedHistoryDay, setSelectedHistoryDay] = useState(() => toDayKey(new Date()));
	const [historyModalOpen, setHistoryModalOpen] = useState(false);
	const [modalEntryDate, setModalEntryDate] = useState(() => toDateInputValue(new Date()));
	const [modalEntryTime, setModalEntryTime] = useState(() => toTimeInputValue(new Date()));
	const [allSmokeEntries, setAllSmokeEntries] = useState<SmokeEntry[]>([]);
	const [clock, setClock] = useState(() => Date.now());
	const [countBump, setCountBump] = useState(false);
	const previousTodayCountRef = useRef(0);
	const unsubscribeRef = useRef<(() => void)[]>([]);
	const bootstrapStartedRef = useRef(false);

	useEffect(() => {
		const timer = setInterval(() => setClock(Date.now()), 1_000);
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
	const statsSeries = buildStatsSeries(statsPeriod, dailyStats, monthlyStats, now);
	const selectedPeriodTotal = getSelectedPeriodTotal(statsPeriod, dailyStats, monthlyStats, now);
	const comparisonLabel = getPeriodComparisonLabel(statsPeriod, selectedPeriodTotal, weightedAverage, now);
	const selectedHistoryEntries = getHistoryEntriesForDay(historyGroups, selectedHistoryDay);
	const historyDaysWithEntries = new Set(historyGroups.map((group) => group.dayKey));
	const timerLabel = formatTimerClock(userProfile?.lastSmokeTimestamp ?? null, now);
	const longestCessationLabel = formatDurationClock(computeLongestCessation(allSmokeEntries, now));
	const averageIntervalLabel = formatDurationClock((computeSleepAwareInterval(allSmokeEntries, now) ?? 0) * 60_000 || null);

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
		if (canonicalUid && !userProfile) {
			saveOnboardingDraft(canonicalUid, onboardingDraft);
		}
	}, [canonicalUid, onboardingDraft, userProfile]);

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
		const [daily, monthly, entries] = await Promise.all([fetchDailyStats(uid), fetchMonthlyStats(uid), fetchAllSmokeEntries(uid)]);
		startTransition(() => {
			setDailyStats(daily);
			setMonthlyStats(monthly);
			setAllSmokeEntries(entries);
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
			setBootstrapErrorDetail(`missing-env:${missingClientEnv.join(',')}`);
			setBootState('blocked');
			return;
		}

		try {
			const bridge = await waitForEvenAppBridge();
			const rawUser = typeof bridge.getUserInfo === 'function' ? await bridge.getUserInfo() : await bridge.callEvenApp(EvenAppMethod.GetUserInfo);
			const normalized = normalizeEvenUserInfo(rawUser);
			if (!normalized) {
				setBlockedMessage('Unable to connect to Even. Please restart the app.');
				setBootstrapErrorDetail('even-user:normalize-failed');
				setBootState('blocked');
				return;
			}

			for (const unsubscribe of unsubscribeRef.current) unsubscribe();
			unsubscribeRef.current = [];

			setEvenUser(normalized);

			const redirectResolution = await resolveGoogleLinkRedirect();
			const firebaseUid = redirectResolution.activeUid ?? (await ensureFirebaseSession());
			const activeAccount = redirectResolution.account ?? getCurrentAccountInfo();

			if (redirectResolution.mergedFromUid && redirectResolution.mergedFromUid !== firebaseUid) {
				await mergeUserData(redirectResolution.mergedFromUid, firebaseUid, normalized, activeAccount);
				moveOnboardingDraft(redirectResolution.mergedFromUid, firebaseUid);
			}

			setAccountInfo(activeAccount);
			setCanonicalUid(firebaseUid);
			setOnboardingDraft(loadSavedOnboarding(firebaseUid, normalized.country));
			await ensureCanonicalUserData(firebaseUid, normalized);
			if (activeAccount) await upsertAuthProviderFields(firebaseUid, activeAccount);

			unsubscribeRef.current = [
				subscribeToUserProfile(firebaseUid, (nextProfile) => {
					startTransition(() => {
						setUserProfile(nextProfile);
						if (!nextProfile) {
							setOnboardingDraft(loadSavedOnboarding(firebaseUid, normalized.country));
						}
					});
				}),
				subscribeToTodayCount(firebaseUid, (count) => {
					startTransition(() => setTodayCount(count));
				}),
			];

			await refreshDerivedData(firebaseUid, true);
			setBootstrapErrorDetail(null);
			setBootState('ready');
		} catch (error) {
			console.error('[Smokeless] bootstrap failed', error);
			setBlockedMessage('Smokeless could not finish startup. Please restart the app.');
			if (error instanceof Error) {
				const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
				setBootstrapErrorDetail(code ? `${code}: ${error.message}` : error.message);
			} else {
				setBootstrapErrorDetail(String(error));
			}
			setBootState('blocked');
		}
	});

	useEffect(() => {
		if (bootstrapStartedRef.current) return;
		bootstrapStartedRef.current = true;
		void bootstrap();
	}, []);

	const handleOnboardingSubmit = useEffectEvent(async () => {
		if (!evenUser || !canonicalUid) return;
		setMutating(true);
		try {
			await saveOnboarding(canonicalUid, evenUser, onboardingDraft, accountInfo);
			clearOnboardingDraft(canonicalUid);
			setEditingOnboarding(false);
			await refreshDerivedData(canonicalUid, true);
			pushToast('Onboarding saved');
		} finally {
			setMutating(false);
		}
	});

	const handleGoogleLink = useEffectEvent(async () => {
		setMutating(true);
		try {
			await startGoogleLinkRedirect();
		} catch (error) {
			console.error('[Smokeless] google link failed to start', error);
			setMutating(false);
			pushToast('Could not start Google linking');
		}
	});

	const handleAddSmoke = useEffectEvent(async () => {
		if (!canonicalUid || !userProfile || mutating) return false;
		const snapshot = { todayCount, lastSmokeTimestamp: userProfile.lastSmokeTimestamp };
		const optimisticNow = new Date();
		setMutating(true);
		startTransition(() => {
			setTodayCount(snapshot.todayCount + 1);
			setUserProfile({ ...userProfile, lastSmokeTimestamp: optimisticNow });
		});

		try {
			await addSmokeEntry(canonicalUid, optimisticNow);
			await refreshDerivedData(canonicalUid, tab === 'history');
			return true;
		} catch (error) {
			console.error('[Smokeless] add smoke failed', error);
			startTransition(() => {
				setTodayCount(snapshot.todayCount);
				setUserProfile({ ...userProfile, lastSmokeTimestamp: snapshot.lastSmokeTimestamp });
			});
			pushToast('Could not log smoke');
			return false;
		} finally {
			setMutating(false);
		}
	});

	const handleAddPastEntry = useEffectEvent(async () => {
		if (!canonicalUid) return;
		setMutating(true);
		try {
			const entryDate = combineDateAndTime(modalEntryDate, modalEntryTime);
			await addSmokeEntry(canonicalUid, entryDate);
			await refreshDerivedData(canonicalUid, true);
			setHistoryModalOpen(false);
			setSelectedHistoryDay(modalEntryDate);
			setHistoryMonth(monthStart(entryDate));
			pushToast('Past smoke added');
		} catch (error) {
			console.error('[Smokeless] add past entry failed', error);
			pushToast('Could not add past entry');
		} finally {
			setMutating(false);
		}
	});

	const handleDeleteEntry = useEffectEvent(async (entry: SmokeEntry) => {
		if (!canonicalUid) return;
		if (!window.confirm(`Soft delete the smoke logged at ${formatTime(entry.timestamp)}?`)) return;
		setMutating(true);
		try {
			await softDeleteSmokeEntry(canonicalUid, entry.id);
			await refreshDerivedData(canonicalUid, true);
			pushToast('Entry deleted');
		} catch (error) {
			console.error('[Smokeless] delete smoke failed', error);
			pushToast('Could not delete entry');
		} finally {
			setMutating(false);
		}
	});

	const handleLoadMoreHistory = useEffectEvent(async () => {
		if (!canonicalUid || !historyHasMore || historyLoading) return;
		setHistoryLoading(true);
		try {
			const page = await fetchHistoryPage(canonicalUid, historyCursor);
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
		if (!canonicalUid || !userProfile) return;
		setMutating(true);
		try {
			await updateProgram(canonicalUid, {
				cigarettesPerDay: onboardingDraft.cigarettesPerDay,
				packPrice: onboardingDraft.packPrice,
				cigarettesPerPack: onboardingDraft.cigarettesPerPack,
				quitProgram: onboardingDraft.quitProgram,
				programTargetCigarettes: onboardingDraft.quitProgram === 'minimum' ? 0 : onboardingDraft.programTargetCigarettes,
				programTargetDate: onboardingDraft.quitProgram === 'minimum' || !onboardingDraft.programTargetDate ? null : new Date(`${onboardingDraft.programTargetDate}T00:00:00`),
				programStartDate: new Date(),
			});
			await refreshDerivedData(canonicalUid, false);
			pushToast('Program saved');
		} finally {
			setMutating(false);
		}
	});

	const handleResetOnboarding = useEffectEvent(() => {
		if (!userProfile || !canonicalUid) return;
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
		saveOnboardingDraft(canonicalUid, nextDraft);
		pushToast('Onboarding reopened');
	});

	const handleExport = useEffectEvent(async () => {
		if (!canonicalUid) return;
		const payload = await exportSmokes(canonicalUid);
		downloadJson(`smokeless-export-${toDayKey(new Date())}.json`, payload);
		pushToast('Export ready');
	});

	const handleDeleteAll = useEffectEvent(async () => {
		if (!canonicalUid) return;
		if (!window.confirm('Delete all Smokeless data?')) return;
		if (!window.confirm('This removes smoke history, stats, and onboarding data. Continue?')) return;
		setMutating(true);
		try {
			await deleteAllUserData(canonicalUid);
			clearOnboardingDraft(canonicalUid);
			setDailyStats({});
			setMonthlyStats({});
			setHistoryGroups([]);
			setHistoryCursor(null);
			setHistoryHasMore(false);
			setAllSmokeEntries([]);
			setTodayCount(0);
			setUserProfile(null);
			pushToast('All data deleted');
		} finally {
			setMutating(false);
		}
	});

	const openHistoryModal = useEffectEvent(() => {
		const baseDate = parseDayKey(selectedHistoryDay);
		setModalEntryDate(toDateInputValue(baseDate));
		setModalEntryTime(toTimeInputValue(new Date()));
		setHistoryModalOpen(true);
	});

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
			<div className="mx-auto flex h-dvhitems-center px-4 py-10">
				<Card padding="default" className="w-full rounded-[20px] border border-border-light bg-surface">
					<div className="flex flex-col gap-4">
						<h1 className="font-[DM_Serif_Display] text-4xl tracking-[-0.04em] text-text">Smokeless</h1>
						<p className="text-normal-body leading-relaxed text-text-dim">{blockedMessage || 'Smokeless could not finish startup. Please restart the app.'}</p>
						{bootstrapErrorDetail ? (
							<div className="rounded-[16px] border border-border-light bg-bg p-3">
								<div className="text-detail uppercase tracking-[0.18em] text-text-dim">Debug</div>
								<p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-text-dim">{bootstrapErrorDetail}</p>
							</div>
						) : null}
					</div>
				</Card>
			</div>
		);
	}

	if (!evenUser || !canonicalUid) return null;

	if (!userProfile || editingOnboarding) {
		return (
			<>
				<AppGlasses snapshot={hudSnapshot} onConfirmSmoke={handleAddSmoke} />
				<OnboardingFlow country={evenUser.country} draft={onboardingDraft} onChange={setOnboardingDraft} onSubmit={handleOnboardingSubmit} />
			</>
		);
	}

	const effectiveAuthProvider = accountInfo?.authProvider ?? userProfile.authProvider ?? 'anonymous';
	const effectiveGoogleEmail = accountInfo?.googleEmail || userProfile.googleEmail;
	const effectiveGoogleDisplayName = accountInfo?.googleDisplayName || userProfile.googleDisplayName;
	const googleLinked = effectiveAuthProvider === 'google';
	const currentCurrency = currencyForCountry(userProfile.evenCountry || evenUser.country);

	return (
		<>
			<AppGlasses snapshot={hudSnapshot} onConfirmSmoke={handleAddSmoke} />

			<div className="smoke-app-shell h-dvh">
				<div className="smoke-app-ornament smoke-app-ornament-top" />
				<div className="smoke-app-ornament smoke-app-ornament-bottom" />

				<div className="relative flex h-full flex-col max-w-md mx-auto overflow-x-visible overflow-y-hidden">
					{tab === 'home' ? <PageHeader title="Today's record" subtitle={formatShortDate(now)} /> : null}
					{tab === 'stats' ? <PageHeader title="Stats" subtitle="Weighted view of your smoking trend" /> : null}
					{tab === 'history' ? (
						<PageHeader
							title="History"
							subtitle="Select a date to view logs"
							action={
								<button type="button" className="inline-flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" onClick={() => void openHistoryModal()} aria-label="Add smoke entry" title="Add smoke entry">
									<span className="text-[2rem] leading-none">+</span>
								</button>
							}
						/>
					) : null}
					{tab === 'settings' ? <PageHeader title="Settings" subtitle="Account, program, and app actions" /> : null}

					<div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible px-4 pb-32">
						{tab === 'home' ? (
							<HomePage
								todayCount={todayCount}
								longestCessationLabel={longestCessationLabel}
								moneySaved={moneySaved}
								timerLabel={timerLabel}
								countBump={countBump}
								mutating={mutating}
								country={userProfile.evenCountry || evenUser.country}
								onAddSmoke={() => void handleAddSmoke()}
							/>
						) : null}

						{tab === 'stats' ? (
							<StatsPage
								statsPeriod={statsPeriod}
								onStatsPeriodChange={setStatsPeriod}
								statsSeries={statsSeries}
								totalSmoked={selectedPeriodTotal}
								comparisonLabel={comparisonLabel}
								weightedAverage={weightedAverage}
								averageIntervalLabel={averageIntervalLabel}
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
								onHistoryMonthChange={setHistoryMonth}
								onHistoryDaySelect={(dayKey, date) => {
									setSelectedHistoryDay(dayKey);
									setHistoryMonth(date);
								}}
								onOpenHistoryModal={() => void openHistoryModal()}
								onDeleteEntry={(entry) => void handleDeleteEntry(entry)}
								onLoadMore={() => void handleLoadMoreHistory()}
							/>
						) : null}

						{tab === 'settings' ? (
							<SettingsPage
								userProfile={userProfile}
								evenName={userProfile.evenName || evenUser.name}
								canonicalUid={canonicalUid}
								googleLinked={googleLinked}
								effectiveGoogleEmail={effectiveGoogleEmail}
								effectiveGoogleDisplayName={effectiveGoogleDisplayName}
								currentCurrency={currentCurrency}
								onboardingDraft={onboardingDraft}
								mutating={mutating}
								onGoogleLink={() => void handleGoogleLink()}
								onDraftChange={(updater) => setOnboardingDraft((current) => updater(current))}
								onProgramSave={() => void handleProgramSave()}
								onResetOnboarding={handleResetOnboarding}
								onExport={() => void handleExport()}
								onDeleteAll={() => void handleDeleteAll()}
							/>
						) : null}
					</div>

					<BottomTabBar activeTab={tab} onChange={(next) => startTransition(() => setTab(next))} />
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
				onSave={() => void handleAddPastEntry()}
			/>

			{toast ? (
				<div className="fixed bottom-28 left-4 right-4 z-[60]">
					<Toast message={toast} />
				</div>
			) : null}
		</>
	);
}
