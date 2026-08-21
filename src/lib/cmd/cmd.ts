import { App, EditorSuggestContext } from "obsidian";
import { Suggestion } from "../suggestion.js";

export const DEBUG_CMD = 'debug';

export type CmdRunner = (
  context: EditorSuggestContext,
  app: App,
  evt: MouseEvent | KeyboardEvent,
) => string;

export const noop: CmdRunner = (context, app, evt) => context.query;

export const debug: CmdRunner = (context, app, evt) => {
  try {
    // debug things here
  } catch (err) {
    console.error(err);
  }

  return '';
}

export const noopSuggestion = (query: string): Suggestion => ({
	cmd: '',
	label: `\u23ce`,
	description: query,
	runCmd: noop,
});

export const debugSuggestion: Suggestion = {
	cmd: 'debug',
	label: '\u23ce',
	runCmd: noop,
};
