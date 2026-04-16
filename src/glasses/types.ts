import type { ImageContainerProperty, ListContainerProperty } from '@evenrealities/even_hub_sdk';

/** One of the three root "tabs" the HUD can display. */
export type HudRootRoute = 'home' | 'stats' | 'history';

/** A single text container within a layout (positions, size, styling). */
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

/**
 * A layout is a stable set of containers. Different `key` values trigger a
 * full `rebuildPageContainer`; same `key` + different content uses
 * `textContainerUpgrade`.
 */
export interface HudLayoutDescriptor {
	key: string;
	textDescriptors: HudTextDescriptor[];
	listObject?: ListContainerProperty[];
	imageObject?: ImageContainerProperty[];
}

/** The tuple a view hands to the render loop: layout plus text contents. */
export interface HudRenderState {
	layout: HudLayoutDescriptor;
	textContents: Record<string, string>;
}
