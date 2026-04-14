import { APP_TABS, type AppTab } from '../types';
import { TAB_ICONS } from './icons';

export function BottomTabBar({ activeTab, onChange }: { activeTab: AppTab; onChange: (nextTab: AppTab) => void }) {
	return (
		<div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-3">
			<div className="smoke-nav-shell mx-auto grid max-w-md grid-cols-4 gap-2 p-2">
				{APP_TABS.map((item) => {
					const isActive = activeTab === item.id;
					const TabIcon = isActive ? TAB_ICONS[item.id].active : TAB_ICONS[item.id].idle;
					return (
						<button
							key={item.id}
							type="button"
							onClick={() => onChange(item.id)}
							className={`pointer-events-auto flex h-14 items-center justify-center rounded-full transition ${isActive ? 'bg-white/[0.16] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]' : 'text-text-dim'}`}
							aria-label={item.label}
							title={item.label}
						>
							<TabIcon width={26} height={26} />
						</button>
					);
				})}
			</div>
		</div>
	);
}
