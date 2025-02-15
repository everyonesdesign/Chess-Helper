import {
  postMessage,
} from './utils';
import {
  toggleBlindfoldMode,
} from './blindfold';
import {
  Command,
  Nullable,
} from './types';
import { i18n } from './i18n';

export const commands : Command[] = [
  {
    name: 'blindfold',
    isAvailable: () => true,
    act: toggleBlindfoldMode,
  },
  {
    name: 'resign',
    isAvailable: () => Boolean(document.querySelector('.resign-button-component')),
    act: () => {
      const resignButton = <Nullable<HTMLButtonElement>>document.querySelector('.resign-button-component');
      resignButton && resignButton.click();
    },
  },
  {
    name: 'draw',
    isAvailable: () => Boolean(document.querySelector('.draw-button-component')),
    act: () => {
      const drawButton = <Nullable<HTMLButtonElement>>document.querySelector('.draw-button-component');
      drawButton && drawButton.click();
    },
  },
  {
    name: 'cancel',
    isAvailable: () => Boolean(document.querySelector('.daily-confirm-move-buttons .cc-button-secondary')),
    act: () => {
      const cancelButton = <Nullable<HTMLButtonElement>>document.querySelector('.daily-confirm-move-buttons .cc-button-secondary');
      cancelButton && cancelButton.click();
    },
  },
  {
    name: 'confirm',
    isAvailable: () => Boolean(document.querySelector('.daily-confirm-move-buttons .cc-button-primary')),
    act: () => {
      const confirmButton = <Nullable<HTMLButtonElement>>document.querySelector('.daily-confirm-move-buttons .cc-button-primary');
      confirmButton && confirmButton.click();
    },
  }
];

/**
 * Parse command text (or return null if not a command)
 */
export function getCommandAction(input: string) : Command | null {
  if (input[0] === '/') {
    const command = commands.find(c => c.name === input.slice(1));

    return command || {
      name: 'no-command-found',
      isAvailable: () => true,
      act: () => {
        postMessage(i18n('commandNotFound', { command: input }));
      },
    };
  }

  return null;
}
