import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import InlineCmd from './main.js';

export interface InlineCmdSettings {
	placeholder: boolean;
}

export const DEFAULT_SETTINGS: InlineCmdSettings = {
	placeholder: true
};

export class InlineCmdSettingsTab extends PluginSettingTab {
	plugin: InlineCmd;

	constructor(app: App, plugin: InlineCmd) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Placeholder')
			.setDesc("I'll do something here eventually").addToggle((value) =>
				value
					.setValue(this.plugin.settings.placeholder)
					.onChange(async (value) => {
						this.plugin.settings.placeholder = value;
						await this.plugin.saveSettings();
						new Notice('woohoo!');
					}),
			);
	}
}
