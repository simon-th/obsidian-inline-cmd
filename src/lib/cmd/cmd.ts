import { App, EditorSuggestContext } from "obsidian";

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
