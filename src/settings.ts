import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import InlineCmd from './main.js';

export interface InlineCmdSettings {
	triggerPhrase: string;
}

export const DEFAULT_SETTINGS: InlineCmdSettings = {
	triggerPhrase: '%',
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
			.setName('Trigger Phrase')
			.setDesc("Phrase on the editor that will trigger the command suggestions").addText((value) =>
				value
					.setValue(this.plugin.settings.triggerPhrase)
					.onChange(async (value) => {
						this.plugin.settings.triggerPhrase = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
