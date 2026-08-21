import { CmdRunner } from "./command.js";

export const debug: CmdRunner = (context, app, evt) => {
  try {
    console.log('debugging stuff');
  } catch (err) {
    console.error(err);
  }

  return '';
}