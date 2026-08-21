import { App, EditorSuggestContext } from 'obsidian';
import {
	CmdRunner,
	DEBUG_CMD,
	debugSuggestion,
	noopSuggestion,
} from './cmd/cmd.js';
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

type CmdRef = typeof DEBUG_CMD | typeof EMBED_CMD | typeof PR_CMD;

const cmdPriorityList: CmdRef[] = [DEBUG_CMD, EMBED_CMD, PR_CMD];

type CmdSuggestionsGetter = (
	app: App,
	context: EditorSuggestContext,
	queryParts: string[],
	limit: number,
) => Promise<Suggestion[]> | Suggestion[];

const suggestionsByCommand: Record<CmdRef, CmdSuggestionsGetter> = {
	[DEBUG_CMD]: () => [debugSuggestion],
	[PR_CMD]: (app, context, queryParts, limit) =>
		getPrSuggestions(app, context, queryParts, limit),
	[EMBED_CMD]: (app, context, queryParts, limit) =>
		getEmbedSuggestions(app, context, queryParts, limit),
};

const allCommands: string = [
	'```',
	'Syntax: cmd;arg1;arg2;...',
	'',
	'unwrapped text is explicit',
	'{} wraps placeholders',
	'() wraps optional args',
	'',
	'e;{block-id} : Embed any block ID reference',
	'pr;{repo}-{pr-number} : Embed PR block reference',
	'pr;<url>;(desc) : Create block reference for a PR',
	'```',
	'',
	'',
].join('\n');

const defaultSuggestions = (query: string): Suggestion[] => {
	return [
		noopSuggestion(query),
		{
			description: 'paste all available commands',
			cmd: '',
			runCmd: () => allCommands,
		},
	];
};

export const getSuggestions = async (
	context: EditorSuggestContext,
	app: App,
	limit: number,
): Promise<Suggestion[]> => {
	const queryParts = context.query?.split(';') ?? [];
	const cmd = queryParts[0] ?? '';

	if (cmd === '') {
		return defaultSuggestions('');
	}

	for (let i = 0; i < cmdPriorityList.length; i++) {
		const cmdRef = cmdPriorityList[i];
		if (
			(queryParts.length > 1 && cmdRef === cmd) ||
			cmdRef?.startsWith(cmd)
		) {
			return suggestionsByCommand[cmdRef](
				app,
				context,
				queryParts,
				limit,
			);
		}
	}

	return defaultSuggestions(context.query ?? '');
};
