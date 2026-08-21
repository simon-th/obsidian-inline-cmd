import { App } from 'obsidian';
import { Suggestion } from '../suggestion.js';
import { CmdRunner } from '../command.js';
import { searchBlocks } from '../../util/block.js';
import { searchSuggestions } from './search.js';

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

const searchPrRefs = async (
	app: App,
	queryRef: string,
	limit: number,
): Promise<Suggestion[]> =>
	searchSuggestions(app, 'pr', 'pr-', queryRef, limit);

export const createPrRefSuggestion: Suggestion = {
	cmd: 'pr',
	label: 'Create PR ref',
	description: 'create block reference to a GitHub pull request',
	note: 'pr;url;desc',
	runCmd: createPrRef,
};

export const searchPrSuggestion: Suggestion = {
	cmd: 'pr',
	label: 'Search PR ref',
	description: 'search for block references to GitHub pull requests',
	note: 'pr;reference',
	runCmd: () => 'Type pr;reference after `%`to search for PR references',
};

export const getPrSuggestions = async (
	app: App,
	queryParts: string[],
	limit: number,
): Promise<Suggestion[]> => {
	if (!queryParts[1]) {
		return [createPrRefSuggestion, searchPrSuggestion];
	} else if (URL_REGEX.test(queryParts[1])) {
		return [createPrRefSuggestion];
	} else {
		return await searchPrRefs(app, queryParts[1], limit);
	}
};
