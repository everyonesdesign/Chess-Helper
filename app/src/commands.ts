import {
  postMessage,
} from './utils';
import {
  Nullable,
} from './types';
import { i18n } from './i18n';

export const commands : Record<string, () => void> = {
  blindfold: () => {
    document.body.classList.toggle('ccHelper-docBody--blindfolded');
  },
  resign: () => {
    const resignButton = <Nullable<HTMLButtonElement>>document.querySelector('.resign-button-component');
    resignButton && resignButton.click();
  },
  draw: () => {
    const drawButton = <Nullable<HTMLButtonElement>>document.querySelector('.draw-button-component');
    drawButton && drawButton.click();
  },
};

/**
 * Parse command text (or return null if not a command)
 * @param  {String} input
 * @return {Function?} - body of the found command
 */
export function parseCommand(input: string) {
  if (input[0] === '/') {
    const command = commands[input.slice(1)];

    return command || (() => {
      postMessage(i18n('commandNotFound', { command: input }));
    });
  }

  return null;
}
