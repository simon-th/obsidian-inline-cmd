import { App, EditorSuggestContext } from 'obsidian';
import { Suggestion } from '../suggestion.js';
import { searchAndReadBlocks } from '../util/block.js';
import { CmdRunner, noop } from './cmd.js';

export const PR_CMD = 'pr';

const URL_REGEX = /^.*:\/\/.*$/;

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
	label: 'Create PR ref',
	description: 'create a block reference to a GitHub PR',
	note: 'pr;url;desc',
	runCmd: createPrRef,
};

export const embedPrRefSuggestion: Suggestion = {
	cmd: PR_CMD,
	label: 'Embed PR ref',
	description: 'embed a block reference to a GitHub PR (no-op)',
	note: 'pr;reference',
	runCmd: noop,
};

export const getPrSuggestions = async (
	app: App,
	context: EditorSuggestContext,
	queryParts: string[],
	limit: number,
): Promise<Suggestion[]> => {
	if (!queryParts[1]) {
		return [createPrRefSuggestion, embedPrRefSuggestion];
	} else if (URL_REGEX.test(queryParts[1])) {
		return [createPrRefSuggestion];
	} else {
		return await searchPrEmbeddings(app, queryParts[1], limit);
	}
};
