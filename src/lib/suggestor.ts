import {
	App,
	Component,
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	MarkdownRenderer,
	TFile,
} from 'obsidian';
import { getSuggestions, Suggestion } from './suggestion.js';
import { EMBED_CMD } from './cmd/embed.js';

export class Suggestor extends EditorSuggest<Suggestion> {
	triggerPhrase: string;

	constructor(app: App, triggerPhrase: string) {
		super(app);
		this.triggerPhrase = triggerPhrase;
		this.limit = 20;
		this.setInstructions([
			{
				command: 'Esc',
				purpose: 'cancel',
			},
		]);
	}

	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
		file: TFile | null,
	): EditorSuggestTriggerInfo | null {
		const start =
			this.context == null
				? {
						line: cursor.line,
						ch: cursor.ch - this.triggerPhrase.length,
					}
				: this.context.start;

		if (!editor.getRange(start, cursor).startsWith(this.triggerPhrase)) {
			return null;
		}

		const preceding = { line: start.line, ch: start.ch - 1 };
		if (start.ch != 0 && editor.getRange(preceding, start) != ' ') {
			return null;
		}

		const queryStart = {
			line: start.line,
			ch: start.ch + this.triggerPhrase.length,
		};

		return {
			start,
			end: cursor,
			query: editor.getRange(queryStart, cursor),
		};
	}

	getSuggestions(
		context: EditorSuggestContext,
	): Suggestion[] | Promise<Suggestion[]> {
		return getSuggestions(context, this.app, this.limit);
	}

	renderSuggestion(value: Suggestion, el: HTMLElement): void {
		el.classList.add('mod-complex');

		const contentEl = el.createDiv();
		contentEl.classList.add('suggestion-content');

		const titleEl = contentEl.createDiv();
		titleEl.classList.add('suggestion-title');

		if (value.markdown) {
			this.renderMarkdown(value.markdown, titleEl);
		} else {
			this.renderStandard(value, titleEl);
		}

		if (value.note) {
			const noteEl = contentEl.createDiv();
			noteEl.classList.add('suggestion-note');
			noteEl.setText(value.note);
		}
	}

	private renderMarkdown(
		markdown: string,
		el: HTMLElement,
	): void {
		const lifecycleComponent = new Component();
		lifecycleComponent.load();

		void MarkdownRenderer.render(
			this.app,
			markdown,
			el,
			this.context?.file?.path ?? '',
			lifecycleComponent,
		);

		el.classList.add('inline-cmd-suggestion');

		lifecycleComponent.unload();
	}

	private renderStandard(value: Suggestion, el: HTMLElement): void {
		const labelEl = el.createEl('p');
		labelEl.setText(value.label ?? value.cmd);
		labelEl.classList.add('inline-cmd-suggestion-label');

		if (value.description) {
			const descEl = el.createEl('p');
			descEl.classList.add('inline-cmd-suggestion-desc');
			descEl.setText(value.description);
		}
	}

	selectSuggestion(value: Suggestion, evt: MouseEvent | KeyboardEvent): void {
		const cmdOutput = this.context
			? value.runCmd(this.context, this.app, evt)
			: '';

		this.context?.editor?.replaceRange(
			cmdOutput,
			this.context?.start,
			this.context?.end,
		);
	}
}
