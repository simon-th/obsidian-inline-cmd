import { App, EditorSuggestContext } from 'obsidian';
import {
	cmdDefsByCommand,
	cmdPriorityList,
	CmdRunner,
	noopSuggestion,
	suggestionsByCommand,
} from './cmd/cmd.js';

export interface Suggestion {
	cmd: string;
	label?: string;
	description?: string;
	note?: string;
	markdown?: string;
	runCmd: CmdRunner;
}

const allCommandsOutput: string = [
	'```',
	'Syntax: cmd;arg1;arg2;...',
	'',
	'unwrapped text is explicit',
	'{} wraps placeholders',
	'() wraps optional args',
	'',
	cmdPriorityList
		.flatMap((cmdRef) => cmdDefsByCommand[cmdRef])
		.map((cmdDef) => [`${cmdDef.syntax}\n- ${cmdDef.description}\n`])
		.join('\n'),
	'```\n\n',
].join('\n');

const defaultSuggestions = (query: string): Suggestion[] => {
	return [
		noopSuggestion(query),
		{
			description: 'paste all available commands',
			cmd: '',
			runCmd: () => allCommandsOutput,
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
