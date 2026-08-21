import { App, BlockCache } from 'obsidian';

export interface BlockRef {
	path: string;
	block: BlockCache;
}

export const searchBlocks = (
	app: App,
	prefix: string,
	query: string,
): BlockRef[] => {
	const lastOpenFilePaths = app.workspace.getLastOpenFiles();
	const filePaths = [
		...lastOpenFilePaths,
		...app.vault
			.getFiles()
			.map((file) => file.path)
			.filter((path) => !lastOpenFilePaths.includes(path)),
	];

	return filePaths.flatMap((path) => {
		return Object.entries(app.metadataCache.getCache(path)?.blocks ?? {})
			.filter(
				([blockId, _]) =>
					blockId.toLowerCase().startsWith(prefix.toLowerCase()) &&
					blockId.toLowerCase().includes(query.toLowerCase()),
			)
			.map(([_, block]) => ({ path, block }));
	});
};

export const readBlockContents = async (
	app: App,
	filePath: string,
	block: BlockCache,
): Promise<string> => {
	const file = app.vault.getFileByPath(filePath);
	if (!file) {
		return '';
	}

	const contents = await app.vault.cachedRead(file);

	const blockLines = contents
		.split('\n')
		.slice(block.position.start.line, block.position.end.line + 1);

	blockLines[0] = blockLines[0]?.substring(block.position.start.col) ?? '';
	blockLines[blockLines.length - 1] =
		blockLines[blockLines.length - 1]?.substring(
			0,
			block.position.end.col,
		) ?? '';

	return blockLines.join('\n');
};
