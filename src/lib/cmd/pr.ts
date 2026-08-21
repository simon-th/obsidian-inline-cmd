import { App, EditorSuggestContext } from 'obsidian';
import { Suggestion } from '../suggestion.js';
import { searchAndReadBlocks } from '../util/block.js';
import { CmdDef, CmdRunner } from './cmd.js';

export const PR_CMD = 'pr';

const URL_REGEX = /^.*:\/\/.*$/;

const embedPrRefCmdDef: CmdDef = {
	label: 'Embed PR ref',
	syntax: 'pr;{repo}-{pull-request-number}',
	description: 'embed a reference to a GitHub pull request',
};

const createPrRefCmdDef: CmdDef = {
	label: 'Create PR ref',
	syntax: 'pr;{url};({description})',
	description: 'create a reference to a GitHub pull request',
};

export const prCmdDefs: CmdDef[] = [embedPrRefCmdDef, createPrRefCmdDef];

const createPrRef: CmdRunner = (context, app, evt): string => {
	const queryParts = context.query?.split(';') ?? [];

	const url = queryParts[1] ?? 'undefined';
	const urlSplit = url.split('/');

	const prNumber = urlSplit[urlSplit.length - 1] ?? '0000';
	const repo = urlSplit[urlSplit.length - 3] ?? 'repo';

	const link = `[**${repo}#${prNumber}**](${url})`;
	const desc = queryParts[2] ? ` ${queryParts[2]}` : '';
	const block = `^pr-${repo}-${prNumber}`;

	return `${link}${desc} ${block}`;
};

const searchPrEmbeddings = async (
	app: App,
	queryRef: string,
	limit: number,
): Promise<Suggestion[]> => {
	const blocks = await searchAndReadBlocks(app, 'pr-', queryRef, limit);
	return blocks.map(({ path, blockId, source, markdown }) => {
		const blockIdSplit = blockId.split('-');

		const prNumber = blockIdSplit[blockIdSplit.length - 1];
		const repo = blockIdSplit.slice(1, blockIdSplit.length - 1).join('-');

		return {
			cmd: PR_CMD,
			markdown,
			note: source,
			runCmd: () => `![[${path}#^${blockId}|${repo}#${prNumber}]]`,
		};
	});
};

export const createPrRefSuggestion: Suggestion = {
	cmd: PR_CMD,
	label: createPrRefCmdDef.label,
	description: createPrRefCmdDef.description,
	note: 'pr;url;desc',
	runCmd: createPrRef,
};

export const getPrSuggestions = async (
	app: App,
	context: EditorSuggestContext,
	queryParts: string[],
	limit: number,
): Promise<Suggestion[]> => {
	if (!queryParts[1]) {
		return [createPrRefSuggestion];
	} else if (URL_REGEX.test(queryParts[1])) {
		return [createPrRefSuggestion];
	} else {
		return await searchPrEmbeddings(app, queryParts[1], limit);
	}
};
