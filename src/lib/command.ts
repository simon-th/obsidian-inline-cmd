import { App, EditorSuggestContext } from "obsidian";

export type CmdRunner = (
  context: EditorSuggestContext,
  app: App,
  evt: MouseEvent | KeyboardEvent,
) => string;

export const noop: CmdRunner = (context, app, evt) => context.query;

export const debug: CmdRunner = (context, app, evt) => {
  try {
    console.log('debugging stuff');
  } catch (err) {
    console.error(err);
  }

  return '';
}