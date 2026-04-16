import type { EvenAppBridge } from '@evenrealities/even_hub_sdk';
import type { Router } from './router';

/**
 * Subscribe the router's active view to all bridge events. The current view
 * handles the event directly (single-dispatch). There is no per-screen
 * registration — the router always routes to the top of the stack.
 */
export function initEventDispatcher(bridge: EvenAppBridge, router: Router): void {
	bridge.onEvenHubEvent((event) => {
		try {
			router.currentView.handleEvent(event);
		} catch (error) {
			console.error('[GlassesEvents] handler threw', error);
		}
	});
}
