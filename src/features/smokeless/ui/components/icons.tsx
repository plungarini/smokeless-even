import {
	IcEditChecklist,
	IcMenuGear,
	IcMenuGearHighlighted,
	IcMenuHome,
	IcMenuHomeHighlighted,
	IcStatusInfo,
} from 'even-toolkit/web/icons/svg-icons';
import type React from 'react';
import type { AppTab } from '../types';

type SvgIcon = React.FC<React.SVGProps<SVGSVGElement>>;

export const TAB_ICONS: Record<AppTab, { idle: SvgIcon; active: SvgIcon }> = {
	home: { idle: IcMenuHome, active: IcMenuHomeHighlighted },
	stats: { idle: IcStatusInfo, active: IcStatusInfo },
	history: { idle: IcEditChecklist, active: IcEditChecklist },
	settings: { idle: IcMenuGear, active: IcMenuGearHighlighted },
};
