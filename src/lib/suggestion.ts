import { App, EditorSuggestContext } from "obsidian"
import { CmdRunner, noop } from "./command.js"

const DEBUG = 'debug';

export interface Suggestion {
  cmd: string,
  label?: string,
  description?: string,
  note?: string,
  markdown?: string,
  cmdRunner: CmdRunner,
}

const noopSuggestion: Suggestion = {
  cmd: '',
  label: '\u23ce',
  cmdRunner: noop,
}

const debugSuggestion: Suggestion = {
  cmd: 'debug',
  label: '\u23ce',
  cmdRunner: noop,
}

export const getSuggestions = (context: EditorSuggestContext, app: App): Suggestion[] => {
  if (context.query != '' && DEBUG.startsWith(context.query)) {
    return [debugSuggestion];
  }
  return [noopSuggestion];
} 