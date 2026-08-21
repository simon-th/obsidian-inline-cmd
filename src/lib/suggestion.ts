import { App, EditorSuggestContext } from 'obsidian';
import { CmdRunner, noop, DEBUG_CMD } from './cmd/cmd.js';
import { EMBED_CMD, getEmbedSuggestions } from './cmd/embed.js';
import { PR_CMD, getPrSuggestions } from './cmd/pr.js';

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
		case DEBUG_CMD.startsWith(cmd):
			return [debugSuggestion];
		case (queryParts.length > 1 && cmd == EMBED_CMD) ||
			EMBED_CMD.startsWith(cmd):
			return await getEmbedSuggestions(app, queryParts, limit);
		case (queryParts.length > 1 && cmd == PR_CMD) || PR_CMD.startsWith(cmd):
			return await getPrSuggestions(app, queryParts, limit);
		default:
			return [noopSuggestion(context.query ?? '')];
	}
};
