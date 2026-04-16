import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Toast controller scoped to the React tree. Glasses have their own
 * transient-status mechanism; toasts are a web-only concept.
 */
export interface ToastApi {
	toast: string;
	push: (message: string) => void;
	dismiss: () => void;
}

const TOAST_DURATION_MS = 3600;

export function useToast(): ToastApi {
	const [toast, setToast] = useState('');
	const timerRef = useRef<number | null>(null);

	const push = useCallback((message: string) => {
		if (timerRef.current !== null) window.clearTimeout(timerRef.current);
		setToast(message);
		timerRef.current = window.setTimeout(() => {
			setToast((current) => (current === message ? '' : current));
			timerRef.current = null;
		}, TOAST_DURATION_MS);
	}, []);

	const dismiss = useCallback(() => {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		setToast('');
	}, []);

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) window.clearTimeout(timerRef.current);
		};
	}, []);

	return { toast, push, dismiss };
}
