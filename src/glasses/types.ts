import type { EvenHubEvent, ListContainerProperty } from '@evenrealities/even_hub_sdk';
import type { HudHistoryDaySummary, HudSnapshot, HudStatsPeriod } from '../domain/types';

export type HudRoute = 'home' | 'stats' | 'history' | 'menu' | 'status';
export type HudRootRoute = 'home' | 'stats' | 'history';
export type HudRootView = 'home' | 'stats' | 'history';

export interface HudUiState {
	route: HudRootRoute;
	statsPeriod: HudStatsPeriod;
	historySelectedDayKey: string | null;
}

export type HudIntent =
	| { type: 'openMenu' }
	| { type: 'closeMenu' }
	| { type: 'goHome' }
	| { type: 'goStats' }
	| { type: 'goHistory' }
	| { type: 'cycleStatsPeriod' }
	| { type: 'historySetDay'; dayKey: string }
	| { type: 'historyPrevDay' }
	| { type: 'historyNextDay' }
	| { type: 'historyResetToday' }
	| { type: 'menuScroll'; index: number };

export interface HudLogSmokeResult {
	ok: boolean;
	todayCount?: number;
	loggedAt?: Date;
	errorMessage?: string;
}

export interface HudActions {
	logSmoke: () => Promise<HudLogSmokeResult>;
	loadMoreHistory: () => Promise<boolean>;
}

export interface HudTransientStatus {
	tone: 'neutral' | 'busy' | 'success' | 'error';
	title: string;
	body: string[];
}

export interface HudTextDescriptor {
	containerID: number;
	containerName: string;
	xPosition: number;
	yPosition: number;
	width: number;
	height: number;
	paddingLength?: number;
	borderWidth?: number;
	borderRadius?: number;
	borderColor?: number;
	isEventCapture?: number;
}

export interface HudLayoutDescriptor {
	key: string;
	textDescriptors: HudTextDescriptor[];
	listObject?: ListContainerProperty[];
}

export interface HudRenderState {
	layout: HudLayoutDescriptor;
	textContents: Record<string, string>;
}

export interface HudScreenRenderContext {
	now: Date;
	snapshot: HudSnapshot;
	ui: HudUiState;
}

export interface HudHomeVisualState {
	mode: 'idle' | 'logging' | 'success' | 'error';
	message: string | null;
	loggedAt: Date | null;
	todayCount: number | null;
}

export interface HomeViewController {
	buildLayout(): HudLayoutDescriptor;
	buildContent(context: HudScreenRenderContext, visualState: HudHomeVisualState): Record<string, string>;
	handleEvent(event: EvenHubEvent, context: HudScreenRenderContext): Promise<HudIntent[]>;
	getUpgradeableContainers(): string[];
}

export interface StatsViewController {
	buildLayout(): HudLayoutDescriptor;
	buildContent(context: HudScreenRenderContext): Record<string, string>;
	handleEvent(event: EvenHubEvent, context: HudScreenRenderContext): Promise<HudIntent[]>;
	getUpgradeableContainers(): string[];
}

export interface HistoryViewController {
	buildLayout(): HudLayoutDescriptor;
	buildContent(context: HudScreenRenderContext, selectedDay: HudHistoryDaySummary | null): Record<string, string>;
	handleEvent(
		event: EvenHubEvent,
		context: HudScreenRenderContext,
		selectedDay: HudHistoryDaySummary | null,
	): Promise<HudIntent[]>;
	getUpgradeableContainers(): string[];
}

export interface MenuViewController {
	buildLayout(): HudLayoutDescriptor;
	buildContent(activeRoute: HudRootRoute): Record<string, string>;
	handleEvent(event: EvenHubEvent): Promise<HudIntent[]>;
	getUpgradeableContainers(): string[];
}
