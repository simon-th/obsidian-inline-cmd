import { Plugin } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	InlineCmdSettings,
	InlineCmdSettingsTab,
} from './settings.js';
import { Suggestor } from './lib/suggestor.js';

export default class InlineCmd extends Plugin {
	settings!: InlineCmdSettings;
	suggestor!: Suggestor;

	async onload() {
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new InlineCmdSettingsTab(this.app, this));

		this.registerEditorSuggest(this.suggestor);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<InlineCmdSettings>,
		);

		this.suggestor = new Suggestor(this.app, this.settings.triggerPhrase);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
