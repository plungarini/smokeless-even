import { useEffect, useRef, useState } from 'react';

/**
 * Drives a 220ms "bump" flag whenever `count` changes. Used by the home
 * page to flash the today-count number after a successful log.
 */
export function useCountBump(count: number): boolean {
	const [bumping, setBumping] = useState(false);
	const previousRef = useRef(count);

	useEffect(() => {
		if (count === previousRef.current) return;
		previousRef.current = count;
		setBumping(true);
		const timer = setTimeout(() => setBumping(false), 220);
		return () => clearTimeout(timer);
	}, [count]);

	return bumping;
}
