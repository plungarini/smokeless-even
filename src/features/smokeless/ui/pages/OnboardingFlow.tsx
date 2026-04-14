import { Badge, Button, Card, ScreenHeader, SectionHeader } from 'even-toolkit/web';
import type { OnboardingDraft } from '../../../../domain/types';
import { currencyForCountry } from '../../../../lib/time';
import { NumericField } from '../components/NumericField';
import { ProgramChoice } from '../components/ProgramChoice';
import { smokeInputClass } from '../styles';

export function OnboardingFlow({
	country,
	draft,
	onChange,
	onSubmit,
}: {
	country: string;
	draft: OnboardingDraft;
	onChange: (next: OnboardingDraft) => void;
	onSubmit: () => Promise<void>;
}) {
	const currency = currencyForCountry(country);

	return (
		<div className="mx-auto max-w-md px-4 pb-10 pt-6">
			<ScreenHeader title="Smokeless" />
			<div className="mt-6 flex flex-col gap-4">
				<Card padding="default" className="rounded-[20px] border border-border-light bg-surface">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-detail uppercase tracking-[0.22em] text-text-dim">Onboarding</div>
							<h2 className="font-[Barlow_Condensed] text-3xl uppercase tracking-[0.08em] text-text">Step {draft.step + 1} of 4</h2>
						</div>
						<Badge variant="accent">{currency}</Badge>
					</div>
				</Card>

				{draft.step === 0 ? (
					<Card padding="default" className="rounded-[20px] border border-border-light bg-surface">
						<div className="flex flex-col gap-4">
							<SectionHeader title="How many cigarettes do you smoke per day?" />
							<NumericField label="Daily baseline" value={draft.cigarettesPerDay} onChange={(value) => onChange({ ...draft, cigarettesPerDay: value })} />
						</div>
					</Card>
				) : null}

				{draft.step === 1 ? (
					<Card padding="default" className="rounded-[20px] border border-border-light bg-surface">
						<div className="flex flex-col gap-4">
							<SectionHeader title="What does a pack cost?" />
							<NumericField label={`Pack price (${currency})`} value={draft.packPrice} step="0.01" onChange={(value) => onChange({ ...draft, packPrice: value })} />
						</div>
					</Card>
				) : null}

				{draft.step === 2 ? (
					<Card padding="default" className="rounded-[20px] border border-border-light bg-surface">
						<div className="flex flex-col gap-4">
							<SectionHeader title="How many cigarettes are in a pack?" />
							<NumericField label="Cigarettes per pack" value={draft.cigarettesPerPack} onChange={(value) => onChange({ ...draft, cigarettesPerPack: value })} />
						</div>
					</Card>
				) : null}

				{draft.step === 3 ? (
					<Card padding="default" className="rounded-[20px] border border-border-light bg-surface">
						<div className="flex flex-col gap-4">
							<SectionHeader title="Set a quit program?" />
							<div className="grid gap-3">
								<ProgramChoice value="linear" active={draft.quitProgram === 'linear'} description="Gradual reduction toward a target date." onSelect={(quitProgram) => onChange({ ...draft, quitProgram })} />
								<ProgramChoice value="fixed" active={draft.quitProgram === 'fixed'} description="Keep a fixed daily cap." onSelect={(quitProgram) => onChange({ ...draft, quitProgram })} />
								<ProgramChoice value="minimum" active={draft.quitProgram === 'minimum'} description="Track only, no target." onSelect={(quitProgram) => onChange({ ...draft, quitProgram })} />
							</div>
							{draft.quitProgram !== 'minimum' ? (
								<div className="grid gap-4 rounded-[16px] border border-border-light bg-bg p-4">
									<NumericField label="Target cigarettes" value={draft.programTargetCigarettes} onChange={(value) => onChange({ ...draft, programTargetCigarettes: value })} />
									<label className="flex flex-col gap-2">
										<span className="text-detail uppercase tracking-[0.18em] text-text-dim">Target date</span>
										<input className={smokeInputClass} type="date" value={draft.programTargetDate} onChange={(event) => onChange({ ...draft, programTargetDate: event.currentTarget.value })} />
									</label>
								</div>
							) : null}
						</div>
					</Card>
				) : null}

				<div className="flex gap-3">
					<Button variant="secondary" className="flex-1" disabled={draft.step === 0} onClick={() => onChange({ ...draft, step: Math.max(0, draft.step - 1) })}>
						Back
					</Button>
					{draft.step < 3 ? (
						<Button variant="highlight" className="flex-1" onClick={() => onChange({ ...draft, step: Math.min(3, draft.step + 1) })}>
							Next
						</Button>
					) : (
						<Button variant="highlight" className="flex-1" onClick={() => void onSubmit()}>
							Start tracking
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
