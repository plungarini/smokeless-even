import { allIcons } from 'even-toolkit/web';
import type React from 'react';
import type { AppTab } from '../types';

type SvgIcon = React.FC<React.SVGProps<SVGSVGElement>>;

const IcHome = allIcons['menu-home'] as SvgIcon;
const IcHomeActive = allIcons['menu-home-highlighted'] as SvgIcon;
const IcStats = allIcons['status-info'] as SvgIcon;
const IcHistory = allIcons['edit-checklist'] as SvgIcon;
const IcSettings = allIcons['setting'] as SvgIcon | undefined;

function GearIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
			<circle cx="12" cy="12" r="3.1" />
			<path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.5 1.5 0 0 1 0 2.1 1.5 1.5 0 0 1-2.1 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1.5 1.5 0 0 1-3 0v-.1a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a1.5 1.5 0 0 1-2.1 0 1.5 1.5 0 0 1 0-2.1l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H5a1.5 1.5 0 0 1 0-3h.1a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a1.5 1.5 0 0 1 0-2.1 1.5 1.5 0 0 1 2.1 0l.1.1a1 1 0 0 0 1.1.2H9a1 1 0 0 0 .6-.9V5a1.5 1.5 0 0 1 3 0v.1a1 1 0 0 0 .7.9 1 1 0 0 0 1.1-.2l.1-.1a1.5 1.5 0 0 1 2.1 0 1.5 1.5 0 0 1 0 2.1l-.1.1a1 1 0 0 0-.2 1.1V9c.1.4.5.7.9.7h.1a1.5 1.5 0 0 1 0 3h-.1a1 1 0 0 0-.9.7Z" />
		</svg>
	);
}

export const TAB_ICONS: Record<AppTab, { idle: SvgIcon; active: SvgIcon }> = {
	home: { idle: IcHome, active: IcHomeActive },
	stats: { idle: IcStats, active: IcStats },
	history: { idle: IcHistory, active: IcHistory },
	settings: { idle: IcSettings ?? GearIcon, active: IcSettings ?? GearIcon },
};
