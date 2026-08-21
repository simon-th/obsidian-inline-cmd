import { App, EditorSuggestContext } from 'obsidian';
import { Suggestion } from '../suggestion.js';
import { searchAndReadBlocks } from '../util/block.js';
import { CmdDef } from './cmd.js';

export const EMBED_CMD = 'e';

const embedBlockCmdDef: CmdDef = {
	label: 'Embed block',
	syntax: 'e;{block-id}',
	description: 'embed any block into your note with a block ID',
};

export const embedCmdDefs: CmdDef[] = [embedBlockCmdDef];

export const searchEmbeddings = async (
	app: App,
	cmd: string,
	prefix: string,
	searchQuery: string,
	limit: number,
): Promise<Suggestion[]> => {
	const blocks = await searchAndReadBlocks(app, prefix, searchQuery, limit);
	return blocks.map(({ path, blockId, markdown, source }) => ({
		cmd,
		markdown,
		note: source,
		runCmd: () => `![[${path}#^${blockId}|${blockId}]]`,
	}));
};

export const getEmbedSuggestions = async (
	app: App,
	context: EditorSuggestContext,
	queryParts: string[],
	limit: number,
): Promise<Suggestion[]> =>
	await searchEmbeddings(
		app,
		EMBED_CMD,
		queryParts[1] ?? '',
		queryParts[2] ?? '',
		limit,
	);
