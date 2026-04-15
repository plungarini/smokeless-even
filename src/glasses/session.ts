import {
	CreateStartUpPageContainer,
	RebuildPageContainer,
	StartUpPageCreateResult,
	TextContainerUpgrade,
	type EvenAppBridge,
} from '@evenrealities/even_hub_sdk';
import type { HudRenderState } from './types';
import { instantiateLayout } from './utils';

export class HudSession {
	private readonly bridge: EvenAppBridge;
	private pageCreated = false;
	private activeLayoutKey: string | null = null;
	private lastContents: Record<string, string> = {};

	constructor(bridge: EvenAppBridge) {
		this.bridge = bridge;
	}

	async render(next: HudRenderState): Promise<void> {
		const params = instantiateLayout(next.layout, next.textContents);

		if (!this.pageCreated) {
			console.log(`[HUD-SESSION] createStartUpPage  key=${next.layout.key}  containers=${params.containerTotalNum}  textKeys=${Object.keys(next.textContents).join(',')}`);
			const created = await this.bridge.createStartUpPageContainer(new CreateStartUpPageContainer(params));
			console.log(`[HUD-SESSION] createStartUpPage result=${created}`);
			if (created === StartUpPageCreateResult.success) {
				this.pageCreated = true;
				this.activeLayoutKey = next.layout.key;
				this.lastContents = { ...next.textContents };
				return;
			}
		}

		if (this.activeLayoutKey !== next.layout.key) {
			console.log(`[HUD-SESSION] rebuildPage  oldKey=${this.activeLayoutKey}  newKey=${next.layout.key}  containers=${params.containerTotalNum}`);
			await this.bridge.rebuildPageContainer(new RebuildPageContainer(params));
			this.pageCreated = true;
			this.activeLayoutKey = next.layout.key;
			this.lastContents = { ...next.textContents };
			return;
		}

		await this.applyUpgrades(next);
	}

	private async applyUpgrades(next: HudRenderState): Promise<void> {
		for (const descriptor of next.layout.textDescriptors) {
			const content = next.textContents[descriptor.containerName] ?? '';
			if (this.lastContents[descriptor.containerName] === content) continue;

			await this.bridge.textContainerUpgrade(
				new TextContainerUpgrade({
					containerID: descriptor.containerID,
					containerName: descriptor.containerName,
					contentOffset: 0,
					contentLength: content.length,
					content,
				}),
			);

			this.lastContents[descriptor.containerName] = content;
		}
	}
}
