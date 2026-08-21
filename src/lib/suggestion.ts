import { App, EditorSuggestContext } from 'obsidian';
import { CmdRunner, noop } from './command.js';

const DEBUG = 'debug';

export interface Suggestion {
	cmd: string;
	label?: string;
	description?: string;
	note?: string;
	markdown?: string;
	runCmd: CmdRunner;
}

const noopSuggestion = (query: string) => ({
	cmd: '',
	label: `\u23ce`,
	description: query,
	runCmd: noop,
});

const debugSuggestion: Suggestion = {
	cmd: 'debug',
	label: '\u23ce',
	runCmd: noop,
};

const sampleSuggestion: Suggestion = {
	cmd: 's',
	label: 'Sample',
	description: 'sample description',
	note: 'sample note',
	runCmd: noop,
};

const sampleBareSuggestion: Suggestion = {
	cmd: 'bare',
	runCmd: noop,
};

const sampleMarkdownSuggestion: Suggestion = {
	cmd: 'md',
	label: 'Uh Oh',
	markdown: `
  ## Some markdown\n
  - list item **bolded**\n
  - [ ] checklist
  `,
	note: 'path/to/source.md',
  runCmd: noop,
};

export const getSuggestions = (
	context: EditorSuggestContext,
	app: App,
): Suggestion[] => {
	if (context.query != '' && DEBUG.startsWith(context.query)) {
		return [debugSuggestion];
	}
	return [
		noopSuggestion(context.query ?? ''),
		sampleBareSuggestion,
		sampleMarkdownSuggestion,
		sampleSuggestion,
	];
};
