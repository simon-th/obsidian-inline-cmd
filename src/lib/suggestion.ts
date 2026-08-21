import { App, EditorSuggestContext } from 'obsidian';
import { CmdRunner, noop } from './command.js';
import { searchSuggestions } from './commands/search.js';
import { getPrSuggestions } from './commands/pr.js';

const DEBUG = 'debug';
const SEARCH = 's';
const PR = 'pr';

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

export const getSuggestions = async (
	context: EditorSuggestContext,
	app: App,
	limit: number,
): Promise<Suggestion[]> => {
	const queryParts = context.query?.split(';') ?? [];

	const cmd = queryParts[0] ?? '';

	switch (true) {
    case cmd === '':
      return [noopSuggestion('')];
		case DEBUG.startsWith(cmd):
			return [debugSuggestion];
		case (queryParts.length > 1 && cmd == SEARCH) || SEARCH.startsWith(cmd):
      return await searchSuggestions(
        app,
				's',
				queryParts[1] ?? '',
				queryParts[2] ?? '',
				limit,
			);
    case (queryParts.length > 1 && cmd == PR) || PR.startsWith(cmd):
      return await getPrSuggestions(app, queryParts, limit);
		default:
			return [noopSuggestion(context.query ?? '')];
	}
};
