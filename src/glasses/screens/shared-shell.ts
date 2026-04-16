import { HUD_BORDER_RADIUS, HUD_WIDTH } from '../constants';
import type { HudLayoutDescriptor, HudRootRoute } from '../types';

/**
 * Layout used by the home and stats views — three containers: header, body,
 * footer. The body is event-capturing. No shield needed because scrolling
 * isn't meaningful on these screens.
 */
export const ROOT_LAYOUT: HudLayoutDescriptor = {
	key: 'root-shell',
	textDescriptors: [
		{
			containerID: 1,
			containerName: 'chrome-header',
			xPosition: 12,
			yPosition: 0,
			width: 200,
			height: 40,
			paddingLength: 4,
		},
		{
			containerID: 2,
			containerName: 'root-body',
			xPosition: 0,
			yPosition: 37,
			width: HUD_WIDTH,
			height: 213,
			paddingLength: 15,
			borderWidth: 1,
			borderColor: 13,
			borderRadius: HUD_BORDER_RADIUS,
			isEventCapture: 1,
		},
		{
			containerID: 3,
			containerName: 'chrome-footer',
			xPosition: 13,
			yPosition: 251,
			width: 270,
			height: 35,
			paddingLength: 4,
		},
	],
};

/**
 * Layout used by the history view. Same root layout + an invisible shield
 * that captures scroll events (so the body's scroll doesn't get eaten by a
 * built-in text scroller).
 */
export const HISTORY_LAYOUT: HudLayoutDescriptor = {
	key: 'history-shell',
	textDescriptors: [
		ROOT_LAYOUT.textDescriptors[0]!,
		{
			...ROOT_LAYOUT.textDescriptors[1]!,
			isEventCapture: 0,
		},
		ROOT_LAYOUT.textDescriptors[2]!,
		{
			containerID: 4,
			containerName: 'history-event-shield',
			xPosition: 0,
			yPosition: 0,
			width: HUD_WIDTH,
			height: 288,
			paddingLength: 0,
			borderWidth: 0,
			isEventCapture: 1,
		},
	],
};

export function buildHeader(now: Date): string {
	return `${formatHeaderTime(now)}   •   Smokeless`;
}

export function buildFooter(activeRoute: HudRootRoute): string {
	const routes: HudRootRoute[] = ['home', 'stats', 'history'];
	const labels: Record<HudRootRoute, string> = {
		home: 'Home',
		stats: 'Stats',
		history: 'History',
	};
	return routes
		.map((route) => (route === activeRoute ? `[${labels[route]}]` : ` ${labels[route]} `))
		.join('      ');
}

function formatHeaderTime(now: Date): string {
	return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}
