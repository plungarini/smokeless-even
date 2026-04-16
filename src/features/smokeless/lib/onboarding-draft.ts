import type { OnboardingDraft } from '../../../domain/types';
import { addDays, toDateInputValue } from '../../../lib/time';
import { bridgeStorageGet, bridgeStorageRemove, bridgeStorageSet } from '../../../services/bridge-storage';

export function createDefaultOnboardingDraft(country: string): OnboardingDraft {
	void country;
	const defaultTargetDate = addDays(new Date(), 90);
	return {
		cigarettesPerDay: 20,
		packPrice: 5,
		cigarettesPerPack: 20,
		quitProgram: 'minimum',
		programTargetCigarettes: 0,
		programTargetDate: toDateInputValue(defaultTargetDate),
		step: 0,
	};
}

export async function loadSavedOnboarding(uid: string, country: string): Promise<OnboardingDraft> {
	try {
		const raw = await bridgeStorageGet(`smokeless:onboarding:${uid}`);
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

export async function saveOnboardingDraft(uid: string, draft: OnboardingDraft): Promise<void> {
	await bridgeStorageSet(`smokeless:onboarding:${uid}`, JSON.stringify(draft));
}

export async function clearOnboardingDraft(uid: string): Promise<void> {
	await bridgeStorageRemove(`smokeless:onboarding:${uid}`);
}

export async function moveOnboardingDraft(sourceUid: string, targetUid: string): Promise<void> {
	if (!sourceUid || !targetUid || sourceUid === targetUid) return;
	const sourceKey = `smokeless:onboarding:${sourceUid}`;
	const targetKey = `smokeless:onboarding:${targetUid}`;
	const sourceDraft = await bridgeStorageGet(sourceKey);
	if (!sourceDraft || (await bridgeStorageGet(targetKey))) return;
	await bridgeStorageSet(targetKey, sourceDraft);
	await bridgeStorageRemove(sourceKey);
}
