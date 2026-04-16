import type { EvenHubEvent } from '@evenrealities/even_hub_sdk';
import type { HudLayoutDescriptor } from './types';

export type ViewKey = 'home' | 'stats' | 'history' | 'menu';

/**
 * Base interface every routed glasses screen implements.
 *
 * The render-loop drives this: on every scheduled render it calls
 * `layout()` + `contents()` and hands the result to the session. Views are
 * stateless in principle — any persistence (cached content, highlighted
 * index, etc.) lives inside the view's own instance fields.
 */
export interface View {
	readonly key: ViewKey;
	layout(): HudLayoutDescriptor;
	contents(): Record<string, string>;
	enter?(): void;
	exit?(): void;
	handleEvent(event: EvenHubEvent): void;
}

type Listener = () => void;

/**
 * Stack-based router. Each `push` adds a view on top (menu is the canonical
 * example — an overlay on top of the underlying route). `reset` replaces the
 * whole stack (used by menu selection to navigate to a new root).
 */
export class Router {
	private stack: ViewKey[];
	private readonly views: Record<ViewKey, View>;
	private readonly listeners = new Set<Listener>();

	constructor(views: Record<ViewKey, View>, initial: ViewKey = 'home') {
		this.views = views;
		this.stack = [initial];
		views[initial].enter?.();
	}

	get currentView(): View {
		const key = this.stack[this.stack.length - 1] ?? 'home';
		return this.views[key];
	}

	get currentKey(): ViewKey {
		return this.stack[this.stack.length - 1] ?? 'home';
	}

	push(key: ViewKey): void {
		if (this.currentKey === key) return;
		this.currentView.exit?.();
		this.stack.push(key);
		this.views[key].enter?.();
		this.notify();
	}

	pop(): ViewKey | null {
		if (this.stack.length <= 1) return null;
		this.currentView.exit?.();
		this.stack.pop();
		this.currentView.enter?.();
		this.notify();
		return this.currentKey;
	}

	/**
	 * Replace the entire stack with the given root view. Use when the user
	 * picks a destination from the menu — we don't want the menu lingering
	 * under them.
	 */
	reset(key: ViewKey): void {
		if (this.stack.length === 1 && this.stack[0] === key) return;
		this.currentView.exit?.();
		this.stack = [key];
		this.views[key].enter?.();
		this.notify();
	}

	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private notify(): void {
		for (const listener of this.listeners) {
			try {
				listener();
			} catch (error) {
				console.error('[Router] listener error', error);
			}
		}
	}
}
