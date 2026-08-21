import {
	App,
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	TFile,
} from 'obsidian';
import { getSuggestions, Suggestion } from './suggestion.js';

export class Suggestor extends EditorSuggest<Suggestion> {
	triggerPhrase: string;

	constructor(app: App, triggerPhrase: string) {
		super(app);
		this.triggerPhrase = triggerPhrase;
    this.limit = 20;
    this.setInstructions([
      {
        command: 'Esc',
        purpose: 'cancel suggestions'
      }
    ])
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
		return getSuggestions(context, this.app);
	}

	renderSuggestion(value: Suggestion, el: HTMLElement): void {
		el.setText(value.label ?? value.cmd);
	}

	selectSuggestion(value: Suggestion, evt: MouseEvent | KeyboardEvent): void {
		const cmdOutput = this.context
			? value.cmdRunner(this.context, this.app, evt)
			: '';

		this.context?.editor?.replaceRange(
			cmdOutput,
			this.context?.start,
			this.context?.end,
		);
	}
}
