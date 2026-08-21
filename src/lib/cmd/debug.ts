import { Suggestion } from "../suggestion.js";
import { CmdRunner } from "./cmd.js";

export const DEBUG_CMD = 'debug';

export const debug: CmdRunner = (context, app, evt) => {
	try {
		// debug things here
	} catch (err) {
		console.error(err);
	}

	return '';
};


export const debugSuggestion: Suggestion = {
	cmd: 'debug',
	label: '\u23ce',
	runCmd: debug,
};
