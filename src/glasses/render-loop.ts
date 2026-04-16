import { appStore } from '../app/store';
import type { Router } from './router';
import { HudSession } from './session';
import type { HudRenderState } from './types';
import { buildStatusRenderState } from './screens/status/status-view';

let session: HudSession | null = null;
let router: Router | null = null;
let isRendering = false;
let renderQueued = false;

/**
 * Wire the render loop to a concrete session + router. Call once from
 * `glasses-main.ts` after the bridge is obtained.
 */
export function initRenderLoop(glassesSession: HudSession, glassesRouter: Router): void {
	session = glassesSession;
	router = glassesRouter;
}

/**
 * Schedule a render of the current view. Debounced via the `isRendering` /
 * `renderQueued` pair — at most one render is in-flight plus one queued.
 */
export function scheduleRender(): void {
	if (!session || !router) return;
	if (isRendering) {
		renderQueued = true;
		return;
	}
	isRendering = true;
	void doRender()
		.catch((error) => {
			console.error('[GlassesRender] render failed', error);
		})
		.finally(() => {
			isRendering = false;
			if (renderQueued) {
				renderQueued = false;
				scheduleRender();
			}
		});
}

async function doRender(): Promise<void> {
	if (!session || !router) return;
	const state = appStore.getState();

	const next: HudRenderState =
		state.phase === 'ready'
			? {
					layout: router.currentView.layout(),
					textContents: router.currentView.contents(),
				}
			: buildStatusRenderState(state.phase, state.statusMessage);

	await session.render(next);
}
