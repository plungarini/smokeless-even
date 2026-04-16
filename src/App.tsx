import { EvenAppMethod, waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { Card, Toast } from 'even-toolkit/web';
import { startTransition, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { missingClientEnv } from './config/env';
import {
	computeDailyTarget,
	computeLongestCessation,
	computeMoneySaved,
	computeWeightedDailyAverage,
} from './domain/calculations';
import type {
	AuthAccountInfo,
	EvenUserInfo,
	GoogleLinkPairingSession,
	HistoryDayGroup,
	HudPendingAction,
	HudSnapshot,
	OnboardingDraft,
	SmokeLogEntry,
	UserDocument,
} from './domain/types';
import { formatShortDate, getHistoryEntriesForDay, monthStart } from './features/smokeless/lib/history-calendar';
import {
	clearOnboardingDraft,
	createDefaultOnboardingDraft,
	loadSavedOnboarding,
	moveOnboardingDraft,
	saveOnboardingDraft,
} from './features/smokeless/lib/onboarding-draft';
import {
	buildStatsSeries,
	formatStatsIntervalLabel,
	getAverageCigsAcrossNonEmptyBuckets,
	getAverageIntervalAcrossNonEmptyBuckets,
	getPeriodComparisonLabel,
	getSelectedPeriodTotal,
} from './features/smokeless/lib/stats-series';
import { AddSmokeModal } from './features/smokeless/ui/components/AddSmokeModal';
import { BottomTabBar } from './features/smokeless/ui/components/BottomTabBar';
import { FullScreenState } from './features/smokeless/ui/components/FullScreenState';
import { PageHeader } from './features/smokeless/ui/components/PageHeader';
import { HistoryPage } from './features/smokeless/ui/pages/HistoryPage';
import { HomePage } from './features/smokeless/ui/pages/HomePage';
import { OnboardingFlow } from './features/smokeless/ui/pages/OnboardingFlow';
import { SettingsPage } from './features/smokeless/ui/pages/SettingsPage';
import { StatsPage } from './features/smokeless/ui/pages/StatsPage';
import type { AppTab, StatsPeriod } from './features/smokeless/ui/types';
import { AppGlasses } from './glasses/AppGlasses';
import type { HudActions, HudIntent, HudUiState } from './glasses/types';
import { normalizeEvenUserInfo } from './lib/even';
import {
	addDays,
	combineDateAndTime,
	currencyForCountry,
	formatDurationClock,
	formatTime,
	formatTimerClock,
	parseDayKey,
	toDateInputValue,
	toDayKey,
	toTimeInputValue,
} from './lib/time';
import {
	ensureFirebaseSession,
	getCurrentAccountInfo,
} from './services/auth';
import {
	clearGooglePairingSession,
	claimReadyGooglePairing,
	completeGoogleLinkCleanup,
	loadActiveGooglePairing,
	refreshGooglePairingStatus,
	startGooglePairing,
	watchGooglePairingStatus,
} from './services/google-link';
import {
	addSmokeEntry,
	deleteAllUserData,
	deleteLogEntry,
	deriveHistoryGroupsFromLogs,
	deriveStatsFromLogs,
	ensureCanonicalUserData,
	exportLogs,
	fetchAllLogEntries,
	saveOnboarding,
	subscribeToTodayCount,
	subscribeToUserDocument,
	updateProgram,
	upsertAuthProviderFields,
} from './services/firestore';

type BootState = 'booting' | 'blocked' | 'ready';

function tabToHudRoute(tab: AppTab): HudUiState['route'] | null {
	if (tab === 'home') return 'home';
	if (tab === 'stats') return 'stats';
	if (tab === 'history') return 'history';
	return null;
}

function stepHistoryDayKey(currentDayKey: string | null, deltaDays: number): string {
	const baseDate = currentDayKey ? parseDayKey(currentDayKey) : new Date();
	return toDayKey(addDays(baseDate, deltaDays));
}

function isTerminalGoogleLinkStatus(status: GoogleLinkPairingSession['status']): boolean {
	return status === 'consumed' || status === 'expired' || status === 'cancelled' || status === 'failed';
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

export default function App() {
	const [bootState, setBootState] = useState<BootState>('booting');
	const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
	const [bootstrapErrorDetail, setBootstrapErrorDetail] = useState<string | null>(null);
	const [canonicalUid, setCanonicalUid] = useState<string | null>(null);
	const [tab, setTab] = useState<AppTab>('home');
	const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('week');
	const [selectedStatsBucketKey, setSelectedStatsBucketKey] = useState<string | null>(null);
	const [toast, setToast] = useState('');
	const [evenUser, setEvenUser] = useState<EvenUserInfo | null>(null);
	const [accountInfo, setAccountInfo] = useState<AuthAccountInfo | null>(null);
	const [googleLinkSession, setGoogleLinkSession] = useState<GoogleLinkPairingSession | null>(null);
	const [userDocument, setUserDocument] = useState<UserDocument | null>(null);
	const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft>(createDefaultOnboardingDraft('US'));
	const [todayCount, setTodayCount] = useState(0);
	const [dailyStats, setDailyStats] = useState<Record<string, number>>({});
	const [monthlyStats, setMonthlyStats] = useState<Record<string, number>>({});
	const [historyGroups, setHistoryGroups] = useState<HistoryDayGroup[]>([]);
	const [historyHasMore, setHistoryHasMore] = useState(false);
	const [historyLoading, setHistoryLoading] = useState(false);
	const [mutating, setMutating] = useState(false);
	const [hudPendingAction, setHudPendingAction] = useState<HudPendingAction>(null);
	const [editingOnboarding, setEditingOnboarding] = useState(false);
	const [historyMonth, setHistoryMonth] = useState(() => monthStart(new Date()));
	const [selectedHistoryDay, setSelectedHistoryDay] = useState(() => toDayKey(new Date()));
	const [hudUi, setHudUi] = useState<HudUiState>({
		route: 'home',
		statsPeriod: 'week',
		historySelectedDayKey: null,
	});
	const [historyModalOpen, setHistoryModalOpen] = useState(false);
	const [modalEntryDate, setModalEntryDate] = useState(() => toDateInputValue(new Date()));
	const [modalEntryTime, setModalEntryTime] = useState(() => toTimeInputValue(new Date()));
	const [allSmokeEntries, setAllSmokeEntries] = useState<SmokeLogEntry[]>([]);
	const [clock, setClock] = useState(() => Date.now());
	const [countBump, setCountBump] = useState(false);
	const [optimisticLastSmokeAt, setOptimisticLastSmokeAt] = useState<Date | null>(null);
	const previousTodayCountRef = useRef(0);
	const unsubscribeRef = useRef<(() => void)[]>([]);
	const bootstrapStartedRef = useRef(false);
	const hudSmokeLockRef = useRef(false);
	const googleSwitchLockRef = useRef(false);
	const googleCleanupLockRef = useRef(false);

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
	const lastSmokeAt = optimisticLastSmokeAt ?? allSmokeEntries[allSmokeEntries.length - 1]?.timestamp ?? null;
	// Quantise to the current minute so that floating-point calculations that
	// depend on `now` don't produce a new value — and therefore a new snapshot —
	// on every 1-second clock tick. We only need minute-level precision here.
	const nowMinute = useMemo(
		() => new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()],
	);
	const hudReferenceNow = useMemo(
		() => new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0),
		[now.getFullYear(), now.getMonth(), now.getDate()],
	);
	const weightedAverage = useMemo(
		() =>
			computeWeightedDailyAverage(
				dailyStats,
				userDocument?.onboarding?.completedAt ?? userDocument?.createdAt ?? null,
				nowMinute,
			),
		[dailyStats, userDocument?.createdAt, userDocument?.onboarding?.completedAt, nowMinute],
	);
	const dailyTarget = computeDailyTarget(userDocument, now);
	const moneySaved = computeMoneySaved(userDocument, weightedAverage, now);
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
	const statsAverageCigs = useMemo(() => getAverageCigsAcrossNonEmptyBuckets(statsSeries), [statsSeries]);
	const statsAverageIntervalLabel = useMemo(
		() => formatStatsIntervalLabel(getAverageIntervalAcrossNonEmptyBuckets(allSmokeEntries, statsSeries)),
		[allSmokeEntries, statsSeries],
	);
	const statsTotalLabel = selectedStatsBucket
		? selectedStatsBucket.label
		: statsPeriod === 'week'
			? 'This week'
			: statsPeriod === 'month'
				? 'This month'
				: 'This year';
	const hudStatsSummaries = useMemo(() => {
		const buildHudStatsSummary = (period: 'week' | 'month' | 'year') => {
			const series = buildStatsSeries(period, dailyStats, monthlyStats, hudReferenceNow);
			const totalSmoked = getSelectedPeriodTotal(period, dailyStats, monthlyStats, hudReferenceNow);
			return {
				period,
				totalSmoked,
				comparisonLabel: getPeriodComparisonLabel(period, totalSmoked, weightedAverage, hudReferenceNow),
				weightedAverage: getAverageCigsAcrossNonEmptyBuckets(series),
				averageIntervalLabel: formatStatsIntervalLabel(
					getAverageIntervalAcrossNonEmptyBuckets(allSmokeEntries, series),
					{ padHours: true },
				),
				series,
			};
		};

		return {
			week: buildHudStatsSummary('week'),
			month: buildHudStatsSummary('month'),
			year: buildHudStatsSummary('year'),
		};
	}, [dailyStats, monthlyStats, hudReferenceNow, weightedAverage, allSmokeEntries]);
	const selectedHistoryEntries = getHistoryEntriesForDay(historyGroups, selectedHistoryDay);
	const historyDaysWithEntries = new Set(historyGroups.map((group) => group.dayKey));
	const timerLabel = formatTimerClock(lastSmokeAt, now);
	const longestCessationLabel = formatDurationClock(computeLongestCessation(allSmokeEntries, now));
	const hudPhase =
		bootState === 'booting'
			? 'booting'
			: bootState === 'blocked'
				? 'blocked'
				: !userDocument?.onboarding || editingOnboarding
					? 'onboarding'
					: 'ready';
	const hudStatusMessage =
		hudPhase === 'booting'
			? 'Connecting to Even and syncing your smoking history.'
			: hudPhase === 'blocked'
				? blockedMessage || 'Smokeless could not finish startup. Please restart the app.'
				: hudPhase === 'onboarding'
					? 'Finish Smokeless setup on your phone to unlock the glasses HUD.'
					: null;

	const hudSnapshot: HudSnapshot = useMemo(
		() => ({
			phase: hudPhase,
			statusMessage: hudStatusMessage,
			home: {
				todayCount,
				lastSmokeAt,
				dailyTarget,
				weightedAverage,
			},
			stats: {
				week: hudStatsSummaries.week,
				month: hudStatsSummaries.month,
				year: hudStatsSummaries.year,
			},
			history: {
				days: historyGroups.map((group) => ({
					dayKey: group.dayKey,
					date: group.date,
					count: group.count,
					entries: group.entries,
				})),
				hasMore: historyHasMore,
				loading: historyLoading || hudPendingAction === 'loadMoreHistory',
			},
			pendingAction: hudPendingAction,
		}),
		[
			hudPhase,
			hudStatusMessage,
			todayCount,
			lastSmokeAt,
			dailyTarget,
			weightedAverage,
			dailyStats,
			monthlyStats,
			hudReferenceNow,
			hudStatsSummaries,
			historyGroups,
			historyHasMore,
			historyLoading,
			hudPendingAction,
		],
	);

	useEffect(() => {
		if (canonicalUid && !userDocument) {
			saveOnboardingDraft(canonicalUid, onboardingDraft);
		}
	}, [canonicalUid, onboardingDraft, userDocument]);

	useEffect(() => {
		if (!userDocument?.onboarding) return;
		const onboarding = userDocument.onboarding;
		setOnboardingDraft({
			cigarettesPerDay: onboarding.cigarettesPerDay,
			packPrice: onboarding.packPrice,
			cigarettesPerPack: onboarding.cigarettesPerPack,
			quitProgram: onboarding.quitProgram,
			programTargetCigarettes: onboarding.programTargetCigarettes,
			programTargetDate: onboarding.programTargetDate
				? toDateInputValue(onboarding.programTargetDate)
				: toDateInputValue(addDays(new Date(), 90)),
			step: 0,
		});
	}, [userDocument]);

	useEffect(() => {
		return () => {
			for (const unsubscribe of unsubscribeRef.current) {
				unsubscribe();
			}
		};
	}, []);

	useEffect(() => {
		const nextRoute = tabToHudRoute(tab);
		if (!nextRoute) return;
		setHudUi((current) => (current.route === nextRoute ? current : { ...current, route: nextRoute }));
	}, [tab]);

	useEffect(() => {
		setSelectedStatsBucketKey(null);
	}, [statsPeriod]);

	useEffect(() => {
		setHudUi((current) => (current.statsPeriod === statsPeriod ? current : { ...current, statsPeriod }));
	}, [statsPeriod]);

	useEffect(() => {
		const nextTab = hudUi.route;
		if (tab !== 'settings' && tab !== nextTab) {
			startTransition(() => setTab(nextTab));
		}
		if (statsPeriod !== hudUi.statsPeriod) {
			startTransition(() => setStatsPeriod(hudUi.statsPeriod));
		}
		if (
			hudUi.route === 'history' &&
			hudUi.historySelectedDayKey &&
			selectedHistoryDay !== hudUi.historySelectedDayKey
		) {
			console.log(
				`[HUD-HISTORY] web sync effect selectedHistoryDay ${selectedHistoryDay} -> ${hudUi.historySelectedDayKey}`,
			);
			const date = parseDayKey(hudUi.historySelectedDayKey);
			startTransition(() => {
				setSelectedHistoryDay(hudUi.historySelectedDayKey!);
				setHistoryMonth(monthStart(date));
			});
		}
	}, [hudUi, selectedHistoryDay, statsPeriod, tab]);

	const handleHudNavigate = useEffectEvent((intent: HudIntent) => {
		setHudUi((current) => {
			const beforeDayKey = current.historySelectedDayKey;
			switch (intent.type) {
				case 'goHome':
					return { ...current, route: 'home' };
				case 'goStats':
					return { ...current, route: 'stats' };
				case 'goHistory':
					return {
						...current,
						route: 'history',
						historySelectedDayKey: current.historySelectedDayKey ?? toDayKey(new Date()),
					};
				case 'cycleStatsPeriod': {
					const periods: StatsPeriod[] = ['week', 'month', 'year'];
					const currentIndex = periods.indexOf(current.statsPeriod);
					return { ...current, route: 'stats', statsPeriod: periods[(currentIndex + 1) % periods.length] ?? 'week' };
				}
				case 'historySetDay':
					console.log(`[HUD-HISTORY] handleHudNavigate set ${beforeDayKey} -> ${intent.dayKey}`);
					return {
						...current,
						route: 'history',
						historySelectedDayKey: intent.dayKey,
					};
				case 'historyPrevDay': {
					const nextDayKey = stepHistoryDayKey(current.historySelectedDayKey ?? selectedHistoryDay, -1);
					console.log(
						`[HUD-HISTORY] handleHudNavigate prev ${beforeDayKey} -> ${nextDayKey} (selectedHistoryDay=${selectedHistoryDay})`,
					);
					return {
						...current,
						route: 'history',
						historySelectedDayKey: nextDayKey,
					};
				}
				case 'historyNextDay': {
					const nextDayKey = stepHistoryDayKey(current.historySelectedDayKey ?? selectedHistoryDay, 1);
					console.log(
						`[HUD-HISTORY] handleHudNavigate next ${beforeDayKey} -> ${nextDayKey} (selectedHistoryDay=${selectedHistoryDay})`,
					);
					return {
						...current,
						route: 'history',
						historySelectedDayKey: nextDayKey,
					};
				}
				case 'historyResetToday':
					console.log(`[HUD-HISTORY] handleHudNavigate reset ${beforeDayKey} -> ${toDayKey(new Date())}`);
					return { ...current, route: 'history', historySelectedDayKey: toDayKey(new Date()) };
				case 'openMenu':
				case 'closeMenu':
					return current;
				default:
					return current;
			}
		});
	});

	const pushToast = useEffectEvent((message: string) => {
		setToast(message);
		window.setTimeout(() => {
			setToast((current) => (current === message ? '' : current));
		}, 2400);
	});

	const refreshDerivedData = useEffectEvent(async (uid: string, includeHistory = false) => {
		const entries = await fetchAllLogEntries(uid);
		const { daily, monthly } = deriveStatsFromLogs(entries);
		const historyGroupsFromLogs = deriveHistoryGroupsFromLogs(entries);
		startTransition(() => {
			setDailyStats(daily);
			setMonthlyStats(monthly);
			setAllSmokeEntries(entries);
			setTodayCount(daily[toDayKey(new Date())] ?? 0);
			setHistoryGroups(historyGroupsFromLogs);
			setHistoryHasMore(false);
			setOptimisticLastSmokeAt(null);
		});

		if (includeHistory) {
			setHistoryLoading(false);
		}
	});

	const claimReadyGoogleLink = useEffectEvent(
		async (session: GoogleLinkPairingSession, options: { showToast?: boolean } = {}) => {
			if (googleSwitchLockRef.current) return null;

			googleSwitchLockRef.current = true;
			try {
				const { targetUid, account, session: switchedSession } = await claimReadyGooglePairing(session);
				moveOnboardingDraft(session.sourceUid, targetUid);
				startTransition(() => {
					setGoogleLinkSession(switchedSession);
					setAccountInfo(account);
				});
				if (options.showToast !== false) {
					pushToast('Google account linked');
				}
				return { targetUid, account, session: switchedSession };
			} catch (error) {
				console.error('[Smokeless] google link claim failed', error);
				if (options.showToast !== false) {
					pushToast('Could not finish Google linking');
				}
				return null;
			} finally {
				googleSwitchLockRef.current = false;
			}
		},
	);

	const cleanupSwitchedGoogleLink = useEffectEvent(
		async (session: GoogleLinkPairingSession, options: { showToast?: boolean } = {}) => {
			if (googleCleanupLockRef.current) return null;
			if (!session.targetGoogleUid) return null;

			googleCleanupLockRef.current = true;
			try {
				const result = await completeGoogleLinkCleanup(session);
				clearGooglePairingSession(session);
				startTransition(() => setGoogleLinkSession(null));
				if (options.showToast !== false) {
					pushToast('Google account linked');
				}
				return result;
			} catch (error) {
				console.error('[Smokeless] google link cleanup failed', error);
				if (options.showToast !== false) {
					pushToast('Could not finish Google cleanup');
				}
				return null;
			} finally {
				googleCleanupLockRef.current = false;
			}
		},
	);

	const bootstrap = useEffectEvent(async () => {
		if (missingClientEnv.length > 0) {
			setBlockedMessage(`Missing web config: ${missingClientEnv.join(', ')}`);
			setBootstrapErrorDetail(`missing-env:${missingClientEnv.join(',')}`);
			setBootState('blocked');
			return;
		}

		try {
			const bridge = await waitForEvenAppBridge();
			const rawUser =
				typeof bridge.getUserInfo === 'function'
					? await bridge.getUserInfo()
					: await bridge.callEvenApp(EvenAppMethod.GetUserInfo);
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

			let firebaseUid = await ensureFirebaseSession();
			let activeAccount = getCurrentAccountInfo();
			let activePairing = loadActiveGooglePairing(firebaseUid);

			if (activePairing) {
				activePairing = await refreshGooglePairingStatus(activePairing);
				startTransition(() => setGoogleLinkSession(activePairing));

				if (activePairing?.status === 'ready_to_switch' && firebaseUid === activePairing.sourceUid) {
					const finalized = await claimReadyGoogleLink(activePairing, { showToast: false });
					if (finalized) {
						firebaseUid = finalized.targetUid;
						activeAccount = finalized.account;
						activePairing = finalized.session;
					}
				}
			} else {
				startTransition(() => setGoogleLinkSession(null));
			}

			activeAccount = activeAccount ?? getCurrentAccountInfo();

			setAccountInfo(activeAccount);
			setCanonicalUid(firebaseUid);
			setOnboardingDraft(loadSavedOnboarding(firebaseUid, normalized.country));
			await ensureCanonicalUserData(firebaseUid, normalized);
			if (activeAccount) await upsertAuthProviderFields(firebaseUid, activeAccount);

			unsubscribeRef.current = [
				subscribeToUserDocument(firebaseUid, (nextDocument) => {
					startTransition(() => {
						setUserDocument(nextDocument);
						if (!nextDocument?.onboarding) {
							setOnboardingDraft(loadSavedOnboarding(firebaseUid, normalized.country));
						}
					});
				}),
				subscribeToTodayCount(firebaseUid, (count) => {
					startTransition(() => setTodayCount(count));
				}),
			];

			await refreshDerivedData(firebaseUid, true);

			if (activePairing?.status === 'switched' && firebaseUid === activePairing.targetGoogleUid) {
				const cleaned = await cleanupSwitchedGoogleLink(activePairing, { showToast: false });
				if (cleaned) {
					activePairing = null;
				}
			}

			if (activePairing && isTerminalGoogleLinkStatus(activePairing.status)) {
				clearGooglePairingSession(activePairing);
				activePairing = null;
				startTransition(() => setGoogleLinkSession(null));
			}

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

	useEffect(() => {
		if (!googleLinkSession) return;

		return watchGooglePairingStatus(googleLinkSession, (nextSession) => {
			startTransition(() => setGoogleLinkSession(nextSession));

			if (!nextSession) {
				return;
			}

			if (nextSession.status === 'ready_to_switch') {
				void (async () => {
					const currentUid = await ensureFirebaseSession();
					if (currentUid !== nextSession.sourceUid) return;
					const finalized = await claimReadyGoogleLink(nextSession);
					if (!finalized) return;
					setBootState('booting');
					await bootstrap();
				})();
				return;
			}

			if (nextSession.status === 'switched') {
				void (async () => {
					const currentUid = await ensureFirebaseSession();
					if (currentUid !== nextSession.targetGoogleUid) return;
					const cleaned = await cleanupSwitchedGoogleLink(nextSession);
					if (!cleaned) return;
					setBootState('booting');
					await bootstrap();
				})();
				return;
			}

			if (nextSession.status === 'expired') {
				clearGooglePairingSession(nextSession);
				pushToast('Google link code expired');
			}

			if (nextSession.status === 'failed') {
				pushToast(nextSession.errorMessage || 'Google linking failed');
			}

			if (isTerminalGoogleLinkStatus(nextSession.status)) {
				clearGooglePairingSession(nextSession);
			}
		});
	}, [bootstrap, claimReadyGoogleLink, cleanupSwitchedGoogleLink, googleLinkSession, pushToast]);

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
		if (!evenUser || !canonicalUid) return;
		setMutating(true);
		try {
			const session = await startGooglePairing(canonicalUid, evenUser.uid);
			startTransition(() => setGoogleLinkSession(session));
			pushToast('Google link code ready');
		} catch (error) {
			console.error('[Smokeless] google link session failed to start', error);
			pushToast('Could not create Google link code');
		} finally {
			setMutating(false);
		}
	});

	const performSmokeLog = useEffectEvent(async () => {
		if (!canonicalUid || !userDocument?.onboarding) {
			return {
				ok: false,
				errorMessage: 'Smokeless is still syncing your account.',
			};
		}

		if (mutating || hudSmokeLockRef.current) {
			return {
				ok: false,
				errorMessage: 'A smoke is already being logged.',
			};
		}

		const snapshot = { todayCount, lastSmokeAt };
		const optimisticNow = new Date();
		hudSmokeLockRef.current = true;
		setMutating(true);
		startTransition(() => {
			setTodayCount(snapshot.todayCount + 1);
			setOptimisticLastSmokeAt(optimisticNow);
		});

		try {
			await addSmokeEntry(canonicalUid, optimisticNow);
			await refreshDerivedData(canonicalUid, tab === 'history' || hudUi.route === 'history');
			return {
				ok: true,
				todayCount: snapshot.todayCount + 1,
				loggedAt: optimisticNow,
			};
		} catch (error) {
			console.error('[Smokeless] add smoke failed', error);
			startTransition(() => {
				setTodayCount(snapshot.todayCount);
				setOptimisticLastSmokeAt(snapshot.lastSmokeAt);
			});
			pushToast('Could not log smoke');
			return {
				ok: false,
				errorMessage: 'Could not log smoke.',
			};
		} finally {
			hudSmokeLockRef.current = false;
			setMutating(false);
		}
	});

	const handleAddSmoke = useEffectEvent(async () => (await performSmokeLog()).ok);

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
			setHudUi((current) => ({
				...current,
				route: 'history',
				historySelectedDayKey: null,
			}));
			pushToast('Past smoke added');
		} catch (error) {
			console.error('[Smokeless] add past entry failed', error);
			pushToast('Could not add past entry');
		} finally {
			setMutating(false);
		}
	});

	const handleDeleteEntry = useEffectEvent(async (entry: SmokeLogEntry) => {
		if (!canonicalUid) return;
		if (!window.confirm(`Delete the smoke logged at ${formatTime(entry.timestamp)}?`)) return;
		setMutating(true);
		try {
			await deleteLogEntry(canonicalUid, entry.id);
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
		return false;
	});

	const hudActions: HudActions = useMemo(
		() => ({
			logSmoke: async () => {
				setHudPendingAction('logSmoke');
				try {
					return await performSmokeLog();
				} finally {
					setHudPendingAction(null);
				}
			},
			loadMoreHistory: async () => {
				setHudPendingAction('loadMoreHistory');
				try {
					return await handleLoadMoreHistory();
				} finally {
					setHudPendingAction(null);
				}
			},
		}),
		[handleLoadMoreHistory, performSmokeLog],
	);

	const handleProgramSave = useEffectEvent(async () => {
		if (!canonicalUid || !userDocument?.onboarding) return;
		setMutating(true);
		try {
			await updateProgram(canonicalUid, {
				cigarettesPerDay: onboardingDraft.cigarettesPerDay,
				packPrice: onboardingDraft.packPrice,
				cigarettesPerPack: onboardingDraft.cigarettesPerPack,
				quitProgram: onboardingDraft.quitProgram,
				programTargetCigarettes:
					onboardingDraft.quitProgram === 'minimum' ? 0 : onboardingDraft.programTargetCigarettes,
				programTargetDate:
					onboardingDraft.quitProgram === 'minimum' || !onboardingDraft.programTargetDate
						? null
						: new Date(`${onboardingDraft.programTargetDate}T00:00:00`),
				programStartDate: new Date(),
			});
			await refreshDerivedData(canonicalUid, false);
			pushToast('Program saved');
		} finally {
			setMutating(false);
		}
	});

	const handleResetOnboarding = useEffectEvent(() => {
		if (!userDocument?.onboarding || !canonicalUid) return;
		const onboarding = userDocument.onboarding;
		const nextDraft: OnboardingDraft = {
			cigarettesPerDay: onboarding.cigarettesPerDay,
			packPrice: onboarding.packPrice,
			cigarettesPerPack: onboarding.cigarettesPerPack,
			quitProgram: onboarding.quitProgram,
			programTargetCigarettes: onboarding.programTargetCigarettes,
			programTargetDate: onboarding.programTargetDate
				? toDateInputValue(onboarding.programTargetDate)
				: toDateInputValue(addDays(new Date(), 90)),
			step: 0,
		};
		setOnboardingDraft(nextDraft);
		setEditingOnboarding(true);
		saveOnboardingDraft(canonicalUid, nextDraft);
		pushToast('Onboarding reopened');
	});

	const handleExport = useEffectEvent(async () => {
		if (!canonicalUid) return;
		const payload = await exportLogs(canonicalUid);
		downloadJson(`smokeless-export-${toDayKey(new Date())}.json`, payload);
		pushToast('Export ready');
	});

	const handleDeleteAll = useEffectEvent(async () => {
		if (!canonicalUid) return;
		if (!window.confirm('Delete all Smokeless data?')) return;
		if (!window.confirm('This removes smoke history, onboarding data, and linked profile data. Continue?')) return;
		setMutating(true);
		try {
			await deleteAllUserData(canonicalUid);
			clearOnboardingDraft(canonicalUid);
			clearGooglePairingSession(googleLinkSession);
			setDailyStats({});
			setMonthlyStats({});
			setHistoryGroups([]);
			setHistoryHasMore(false);
			setAllSmokeEntries([]);
			setTodayCount(0);
			setGoogleLinkSession(null);
			setUserDocument(null);
			setOptimisticLastSmokeAt(null);
			pushToast('All data deleted');
		} finally {
			setMutating(false);
		}
	});

	const handleCopyGoogleCode = useEffectEvent(async () => {
		if (!googleLinkSession?.code || !navigator.clipboard?.writeText) return;
		await navigator.clipboard.writeText(googleLinkSession.code);
		pushToast('Code copied');
	});

	const handleCopyGoogleLinkUrl = useEffectEvent(async () => {
		if (!googleLinkSession?.linkUrl || !navigator.clipboard?.writeText) return;
		await navigator.clipboard.writeText(googleLinkSession.linkUrl);
		pushToast('Link copied');
	});

	const handleOpenGoogleLinkUrl = useEffectEvent(() => {
		if (!googleLinkSession?.linkUrl) return;
		window.open(googleLinkSession.linkUrl, '_blank', 'noopener,noreferrer');
	});

	const openHistoryModal = useEffectEvent(() => {
		const baseDate = parseDayKey(selectedHistoryDay);
		setModalEntryDate(toDateInputValue(baseDate));
		setModalEntryTime(toTimeInputValue(new Date()));
		setHistoryModalOpen(true);
	});

	// ── Derived values that are only valid when fully loaded ──
	const effectiveAuthProvider =
		evenUser && canonicalUid && userDocument
			? (accountInfo?.authProvider ?? (userDocument.providers.google ? 'google' : 'anonymous'))
			: 'anonymous';
	const effectiveGoogleEmail =
		evenUser && canonicalUid && userDocument
			? accountInfo?.googleEmail || userDocument.providers.google?.email
			: undefined;
	const effectiveGoogleDisplayName =
		evenUser && canonicalUid && userDocument
			? accountInfo?.googleDisplayName || userDocument.providers.google?.displayName
			: undefined;
	const googleLinked = effectiveAuthProvider === 'google';
	const googleLinkExpiresInSeconds = googleLinkSession
		? Math.max(0, Math.floor((new Date(googleLinkSession.expiresAt).getTime() - clock) / 1000))
		: null;
	const currentCurrency =
		evenUser && canonicalUid && userDocument
			? currencyForCountry(userDocument.providers.even?.country || evenUser.country)
			: 'EUR';

	// ── Single stable render: AppGlasses is ALWAYS at position 0 ──
	// This prevents React from unmounting/remounting it when the app
	// transitions between boot states, onboarding, etc.
	return (
		<>
			<AppGlasses snapshot={hudSnapshot} actions={hudActions} ui={hudUi} onNavigate={handleHudNavigate} />

			{bootState === 'booting' ? (
				<FullScreenState title="Smokeless" body="Connecting to Even and loading your smoking data." loading />
			) : bootState === 'blocked' ? (
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
						</div>
					</Card>
				</div>
			) : !evenUser || !canonicalUid ? null : !userDocument?.onboarding || editingOnboarding ? (
				<OnboardingFlow
					country={evenUser.country}
					draft={onboardingDraft}
					onChange={setOnboardingDraft}
					onSubmit={handleOnboardingSubmit}
				/>
			) : (
				<>
					<div className="smoke-app-shell h-dvh">
						<div className="smoke-app-ornament smoke-app-ornament-top" />
						<div className="smoke-app-ornament smoke-app-ornament-bottom" />

						<div className="relative flex h-full flex-col max-w-md mx-auto overflow-x-visible overflow-y-hidden">
							{tab === 'home' ? <PageHeader title="Today's record" subtitle={formatShortDate(now)} /> : null}
							{tab === 'stats' ? <PageHeader title="Stats" subtitle="Weighted view of your smoking trend" /> : null}
							{tab === 'history' ? <PageHeader title="History" subtitle="Select a date to view logs" /> : null}
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
										country={userDocument.providers.even?.country || evenUser.country}
										onAddSmoke={() => void handleAddSmoke()}
									/>
								) : null}

								{tab === 'stats' ? (
									<StatsPage
										statsPeriod={statsPeriod}
										onStatsPeriodChange={(period) => {
											setStatsPeriod(period);
											setHudUi((current) =>
												current.statsPeriod === period ? current : { ...current, statsPeriod: period },
											);
										}}
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
										onHistoryMonthChange={setHistoryMonth}
										onHistoryDaySelect={(dayKey, date) => {
											setSelectedHistoryDay(dayKey);
											setHistoryMonth(date);
											setHudUi((current) => ({
												...current,
												route: 'history',
												historySelectedDayKey: dayKey,
											}));
										}}
										onOpenHistoryModal={() => void openHistoryModal()}
										onDeleteEntry={(entry) => void handleDeleteEntry(entry)}
										onLoadMore={() => void handleLoadMoreHistory()}
									/>
								) : null}

								{tab === 'settings' ? (
									<SettingsPage
										userDocument={userDocument}
										evenName={userDocument.providers.even?.name || evenUser.name}
										canonicalUid={canonicalUid}
										googleLinked={googleLinked}
										googleLinkSession={googleLinkSession}
										googleLinkExpiresInSeconds={googleLinkExpiresInSeconds}
										effectiveGoogleEmail={effectiveGoogleEmail}
										effectiveGoogleDisplayName={effectiveGoogleDisplayName}
										currentCurrency={currentCurrency}
										onboardingDraft={onboardingDraft}
										mutating={mutating}
										onGoogleLink={() => void handleGoogleLink()}
										onCopyGoogleCode={() => void handleCopyGoogleCode()}
										onCopyGoogleLinkUrl={() => void handleCopyGoogleLinkUrl()}
										onOpenGoogleLinkUrl={handleOpenGoogleLinkUrl}
										onDraftChange={(updater) => setOnboardingDraft((current) => updater(current))}
										onProgramSave={() => void handleProgramSave()}
										onResetOnboarding={handleResetOnboarding}
										onExport={() => void handleExport()}
										onDeleteAll={() => void handleDeleteAll()}
									/>
								) : null}
							</div>

							<BottomTabBar
								activeTab={tab}
								onChange={(next) =>
									startTransition(() => {
										setTab(next);
										const nextRoute = tabToHudRoute(next);
										if (nextRoute) {
											setHudUi((current) => ({
												...current,
												route: nextRoute,
												historySelectedDayKey: nextRoute === 'history' ? current.historySelectedDayKey : null,
											}));
										}
									})
								}
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
						onSave={() => void handleAddPastEntry()}
					/>

					{toast ? (
						<div className="fixed bottom-28 left-4 right-4 z-[60]">
							<Toast message={toast} />
						</div>
					) : null}
				</>
			)}
		</>
	);
}
