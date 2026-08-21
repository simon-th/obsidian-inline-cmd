import { App, EditorSuggestContext } from 'obsidian';
import { CmdRunner, noop } from './command.js';
import { searchSuggestions } from './search.js';

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

export const getSuggestions = async (
	context: EditorSuggestContext,
	app: App,
  limit: number,
): Promise<Suggestion[]> => {
  const queryParts = context.query?.split(';') ?? [];

  const cmd = queryParts[0] ?? '';
  
  if (cmd !== '' && DEBUG.startsWith(cmd)) {
		return [debugSuggestion];
	}

	switch(true) {
    case (cmd !== '' && DEBUG.startsWith(cmd)):
      return [debugSuggestion];
    case (cmd === 's'):
      return await searchSuggestions(app, queryParts, limit);
    default:
      return [noopSuggestion(context.query ?? '')];
  }
};
