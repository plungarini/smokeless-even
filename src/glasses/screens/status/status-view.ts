import type { HudPhase } from '../../../domain/types';
import { HUD_HEIGHT, HUD_WIDTH } from '../../constants';
import type { HudLayoutDescriptor, HudRenderState } from '../../types';
import { buildStatusBox } from '../../utils';

const STATUS_LAYOUT: HudLayoutDescriptor = {
	key: 'status',
	textDescriptors: [
		{
			containerID: 1,
			containerName: 'status-box',
			xPosition: 0,
			yPosition: 54,
			width: HUD_WIDTH,
			height: HUD_HEIGHT - 108,
			paddingLength: 8,
			isEventCapture: 1,
		},
	],
};

/**
 * Build the render state for non-`ready` phases. The render-loop bypasses
 * the router and calls this directly when `appStore.phase !== 'ready'`.
 */
export function buildStatusRenderState(phase: HudPhase, statusMessage: string | null): HudRenderState {
	const body =
		phase === 'blocked'
			? [statusMessage ?? 'Please restart the app on your phone.']
			: [statusMessage ?? 'Connecting to Even and syncing your smoking history.'];
	return {
		layout: STATUS_LAYOUT,
		textContents: {
			'status-box': buildStatusBox('Smokeless', body),
		},
	};
}
