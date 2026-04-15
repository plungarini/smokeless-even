import { HUD_HEIGHT, HUD_WIDTH } from '../constants';
import type { HudLayoutDescriptor, HudRenderState, HudTransientStatus } from '../types';
import { buildStatusBox } from '../utils';

export class StatusScreen {
	readonly layout: HudLayoutDescriptor = {
		key: 'status',
		textDescriptors: [
			{
				containerID: 1,
				containerName: 'status-box',
				xPosition: 54,
				yPosition: 54,
				width: HUD_WIDTH - 108,
				height: HUD_HEIGHT - 108,
				paddingLength: 8,
				isEventCapture: 1,
			},
		],
	};

	build(status: HudTransientStatus): HudRenderState {
		return {
			layout: this.layout,
			textContents: {
				'status-box': buildStatusBox(status.title, status.body),
			},
		};
	}
}
