import { App } from 'obsidian';
import { Suggestion } from '../suggestion.js';
import { readBlockContents, searchBlocks } from '../../util/block.js';

export const searchSuggestions = async (
	app: App,
	cmd: string,
	prefix: string,
	searchQuery: string,
	limit: number,
): Promise<Suggestion[]> => {
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
				cmd,
				markdown,
        runCmd: () => `[[${blockRef.path}#^${blockRef.block.id}|${display}]]`,
        note: `${blockRef.path} > ${blockRef.block.id}`
			};
		}),
	);
};
