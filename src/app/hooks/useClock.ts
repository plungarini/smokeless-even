import { useSyncExternalStore } from 'react';
import { getNowMs, subscribeClock } from '../clock';

/**
 * Subscribe to the app-wide 1s clock. Only components that render a live
 * timer should call this — everyone else should prefer `useAppSelector`
 * which only re-renders on actual data changes.
 */
export function useClockMs(): number {
	return useSyncExternalStore(subscribeClock, getNowMs, getNowMs);
}

export function useClock(): Date {
	const ms = useClockMs();
	return new Date(ms);
}
