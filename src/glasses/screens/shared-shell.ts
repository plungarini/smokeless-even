import { HUD_BORDER_RADIUS, HUD_HEIGHT, HUD_WIDTH } from '../constants';
import type { HudLayoutDescriptor, HudRootRoute } from '../types';

/**
 * Unified 4-container layout shared by home, stats, and history.
 *
 * Using the same key for all three means no rebuildPageContainer is ever
 * needed when navigating between them — only upgrading text contents.
 *
 * Container structure:
 *   1  header  — top bar (time + app name)
 *   2  body    — main content, isEventCapture:0 so its internal text
 *               scroller doesn't eat gestures
 *   3  footer  — tab bar
 *   4  shield  — invisible full-screen overlay, isEventCapture:1
 *               captures all gestures and forwards them to the app
 */
export const ROOT_LAYOUT: HudLayoutDescriptor = {
	key: 'root',
	textDescriptors: [
		{
			containerID: 0,
			containerName: 'shield',
			xPosition: 0,
			yPosition: 0,
			width: 0,
			height: HUD_HEIGHT,
			isEventCapture: 1,
		},
		{
			containerID: 1,
			containerName: 'header',
			xPosition: 12,
			yPosition: 0,
			width: 200,
			height: 40,
			paddingLength: 4,
		},
		{
			containerID: 2,
			containerName: 'body',
			xPosition: 0,
			yPosition: 37,
			width: HUD_WIDTH,
			height: 213,
			paddingLength: 15,
			borderWidth: 1,
			borderColor: 13,
			borderRadius: HUD_BORDER_RADIUS,
			isEventCapture: 0,
		},
		{
			containerID: 3,
			containerName: 'footer',
			xPosition: 13,
			yPosition: 251,
			width: 270,
			height: 35,
			paddingLength: 4,
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
	return routes.map((route) => (route === activeRoute ? `[${labels[route]}]` : ` ${labels[route]} `)).join('      ');
}

function formatHeaderTime(now: Date): string {
	return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}
