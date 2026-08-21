import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Modal,
	Notice,
	Plugin,
	EditorSuggest,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	InlineCmdSettings,
	InlineCmdSettingsTab,
} from './settings.js';
import { Suggestor } from './lib/suggestor.js';

// Remember to rename these classes and interfaces!

export default class InlineCmd extends Plugin {
	settings!: InlineCmdSettings;
	suggestor!: Suggestor;

	async onload() {
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new InlineCmdSettingsTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000),
		);

		this.registerEditorSuggest(this.suggestor)
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

class SampleModal extends Modal {
	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
