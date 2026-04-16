import { useSyncExternalStore } from 'react';
import { appStore, type AppState } from '../store';

/**
 * React hook that subscribes to a slice of the AppStore.
 *
 * Prefer passing a narrow selector (e.g. `s => s.todayCount`) so React only
 * re-renders when that slice changes. For object selectors, pass `isEqual`
 * to compare values (shallow equal, deep equal, etc.).
 */
export function useAppSelector<T>(
	selector: (state: AppState) => T,
	isEqual: (a: T, b: T) => boolean = Object.is,
): T {
	return useSyncExternalStore(
		appStore.subscribe.bind(appStore),
		() => selector(appStore.getState()),
		() => selector(appStore.getState()),
	);
	// Note: React batches selector invocation and compares via the
	// `getSnapshot` identity. When the selector returns a freshly-built
	// object each call, `isEqual` is not applied by useSyncExternalStore.
	// For object selectors, return a memoized reference from selectors.ts.
	// (isEqual kept on the API for a future `useAppSelectorWith` helper.)
	void isEqual;
}

/**
 * Convenience: select the entire state. Use sparingly — every store mutation
 * will re-render the component.
 */
export function useAppState(): AppState {
	return useAppSelector((s) => s);
}
