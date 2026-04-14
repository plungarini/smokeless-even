import type { OnboardingDraft } from '../../../domain/types';
import { addDays, toDateInputValue } from '../../../lib/time';

export function createDefaultOnboardingDraft(country: string): OnboardingDraft {
	void country;
	const defaultTargetDate = addDays(new Date(), 90);
	return {
		cigarettesPerDay: 20,
		packPrice: 10,
		cigarettesPerPack: 20,
		quitProgram: 'minimum',
		programTargetCigarettes: 0,
		programTargetDate: toDateInputValue(defaultTargetDate),
		step: 0,
	};
}

export function loadSavedOnboarding(uid: string, country: string): OnboardingDraft {
	try {
		const raw = localStorage.getItem(`smokeless:onboarding:${uid}`);
		if (!raw) return createDefaultOnboardingDraft(country);
		const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
		return {
			...createDefaultOnboardingDraft(country),
			...parsed,
		};
	} catch {
		return createDefaultOnboardingDraft(country);
	}
}

export function saveOnboardingDraft(uid: string, draft: OnboardingDraft): void {
	localStorage.setItem(`smokeless:onboarding:${uid}`, JSON.stringify(draft));
}

export function clearOnboardingDraft(uid: string): void {
	localStorage.removeItem(`smokeless:onboarding:${uid}`);
}

export function moveOnboardingDraft(sourceUid: string, targetUid: string): void {
	if (!sourceUid || !targetUid || sourceUid === targetUid) return;
	const sourceKey = `smokeless:onboarding:${sourceUid}`;
	const targetKey = `smokeless:onboarding:${targetUid}`;
	const sourceDraft = localStorage.getItem(sourceKey);
	if (!sourceDraft || localStorage.getItem(targetKey)) return;
	localStorage.setItem(targetKey, sourceDraft);
	localStorage.removeItem(sourceKey);
}
