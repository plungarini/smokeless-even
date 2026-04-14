import { Card, Loading } from 'even-toolkit/web';

export function FullScreenState({ title, body, loading = false }: { title: string; body: string; loading?: boolean }) {
	return (
		<div className="mx-auto flex h-dvh max-w-md items-center px-4 py-10">
			<Card padding="default" className="w-full rounded-[20px] border border-border-light bg-surface">
				<div className="flex flex-col gap-4">
					{loading ? (
						<div className="flex items-center gap-3">
							<Loading size={18} />
							<span className="text-detail uppercase tracking-[0.24em] text-text-dim">Starting Smokeless</span>
						</div>
					) : null}
					<h1 className="font-[DM_Serif_Display] text-4xl tracking-[-0.04em] text-text">{title}</h1>
					<p className="text-normal-body leading-relaxed text-text-dim">{body}</p>
				</div>
			</Card>
		</div>
	);
}
