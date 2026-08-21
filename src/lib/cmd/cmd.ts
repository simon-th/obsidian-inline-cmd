import { App, EditorSuggestContext } from 'obsidian';
import { Suggestion } from '../suggestion.js';
import { EMBED_CMD, embedCmdDefs, getEmbedSuggestions } from './embed.js';
import { PR_CMD, prCmdDefs, getPrSuggestions } from './pr.js';
import { DEBUG_CMD, debugSuggestion } from './debug.js';

type CmdRef = typeof DEBUG_CMD | typeof EMBED_CMD | typeof PR_CMD;

type CmdSuggestionsGetter = (
	app: App,
	context: EditorSuggestContext,
	queryParts: string[],
	limit: number,
) => Promise<Suggestion[]> | Suggestion[];

export type CmdRunner = (
	context: EditorSuggestContext,
	app: App,
	evt: MouseEvent | KeyboardEvent,
) => string;

export interface CmdDef {
	label: string;
	description: string;
	syntax: string;
}

export const cmdPriorityList: CmdRef[] = [DEBUG_CMD, EMBED_CMD, PR_CMD];

export const noop: CmdRunner = (context, app, evt) => context.query;

export const noopSuggestion = (query: string): Suggestion => ({
	cmd: '',
	label: `\u23ce`,
	description: query,
	runCmd: noop,
});

export const suggestionsByCommand: Record<CmdRef, CmdSuggestionsGetter> = {
	[DEBUG_CMD]: () => [debugSuggestion],
	[PR_CMD]: (app, context, queryParts, limit) =>
		getPrSuggestions(app, context, queryParts, limit),
	[EMBED_CMD]: (app, context, queryParts, limit) =>
		getEmbedSuggestions(app, context, queryParts, limit),
};

export const cmdDefsByCommand: Record<CmdRef, CmdDef[]> = {
	[DEBUG_CMD]: [],
	[EMBED_CMD]: embedCmdDefs,
	[PR_CMD]: prCmdDefs,
};
