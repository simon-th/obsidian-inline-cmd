import { App } from 'obsidian';
import { Suggestion } from '../suggestion.js';
import { readBlockContents, searchBlocks } from '../../util/block.js';

export interface SearchBlockResult {
	path: string;
	blockId: string;
	source: string;
	markdown?: string;
}

export const searchAndReadBlocks = async (
	app: App,
	prefix: string,
	searchQuery: string,
	limit: number,
): Promise<SearchBlockResult[]> => {
	const blocks = searchBlocks(app, prefix, searchQuery);
	return await Promise.all(
		blocks.map(async (blockRef, index) => {
			const display = blockRef.block.id;

			const markdown =
				index < limit
					? await readBlockContents(
							app,
							blockRef.path,
							blockRef.block,
						)
					: undefined;

			return {
				path: blockRef.path,
				blockId: blockRef.block.id,
				source: `${blockRef.path} > ${blockRef.block.id}`,
				markdown,
			};
		}),
	);
};

export const searchSuggestions = async (
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
		runCmd: () => `[[${path}#^${blockId}|${blockId}]]`,
	}));
};
