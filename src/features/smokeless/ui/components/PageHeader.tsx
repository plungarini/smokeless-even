export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<header className="smoke-page-header shrink-0 px-4 pb-4 pt-[max(16px,env(safe-area-inset-top,0px)+8px)]">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="smoke-page-title">{title}</h1>
					{subtitle ? <p className="mt-2 text-[15px] text-text-dim">{subtitle}</p> : null}
				</div>
			</div>
		</header>
	);
}
