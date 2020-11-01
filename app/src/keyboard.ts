import {
  go,
} from './chess';
import {
  getBoard,
} from './chessboard';
import {
  holdingCtrlOrCmd,
  isEditable,
  isModifierPressed,
} from './utils';
import {
  Nullable,
} from './types';

const KEY_CODES = {
  enter: 13,
  leftArrow: 37,
  topArrow: 38,
  rightArrow: 39,
  bottomArrow: 40,
  escape: 27,
};

/**
 * Bind hotkeys connected with focusing of the input
 */
export function bindInputFocus(input: HTMLInputElement) {
  document.addEventListener('keydown', (e) => {
    if (isModifierPressed(e)) {
      // prevent native events from being prevented
      // e.g. Ctrl + C
      return;
    }

    if (e.keyCode === KEY_CODES.escape && e.target !== input) {
      setTimeout(() => {
        if (document.activeElement) {
          const activeElement = <HTMLElement>document.activeElement;
          activeElement.blur();
        }
      });
    } else if (
      // latin & cyrillic
      /^[cс]$/i.test(e.key) &&
      e.target !== input &&
      !isEditable(<Nullable<Element>>e.target)
    ) {
      e.preventDefault();
      input.focus();
    }
  });
}

/**
 * Handle keyDown event on the input
 * Responsible for submitting move, backward/forward moves, etc.
 */
export function bindInputKeyDown(input: HTMLInputElement) {
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();

    if (e.keyCode === KEY_CODES.enter) {
      if (!input.value) {
        return;
      }

      const board = getBoard();

      if (board) {
        const success = go(board, input.value);
        board && board.clearMarkedArrows();

        if (success) {
          input.value = '';

          // needed to remove autocomplete
          // after successful command execution
          setTimeout(() => {
            const event = new Event('keyup');
            input.dispatchEvent(event);
          }, 200);
        }
      }

      input.focus();
    } else if (e.keyCode === KEY_CODES.escape) {
      input.value = '';

      const board = getBoard();
      board && board.clearAllMarkings();
      e.preventDefault();
    } else if (holdingCtrlOrCmd(e)) {
      if (e.keyCode === KEY_CODES.leftArrow) {
        const sel = `
          .move-list-buttons .icon-chevron-left,
          .control-group .icon-chevron-left,
          .move-list-buttons-component .icon-chevron-left
        `;
        const potentialElement = document.querySelector(sel);
        if (potentialElement) {
          const clickTarget = <HTMLElement>potentialElement;
          clickTarget.click();
        }
      } else if (e.keyCode === KEY_CODES.rightArrow) {
        const sel = `
          .move-list-buttons .icon-chevron-right,
          .control-group .icon-chevron-right,
          .move-list-buttons-component .icon-chevron-right
        `;
        const potentialElement = document.querySelector(sel);
        if (potentialElement) {
          const clickTarget = <HTMLElement>potentialElement;
          clickTarget.click();
        }
      }
    }
  });
}

/**
 * Bind keyboards listeners to peek from keyboard
 * in blindfold mode
 */
export function bindBlindFoldPeek(input: HTMLInputElement) {
  const updatePeekClass = (e: KeyboardEvent) => {
    document.body.classList.toggle('ccHelper-docBody--peeked', !!e.ctrlKey);
  };
  document.body.addEventListener('keydown', updatePeekClass);
  document.body.addEventListener('keyup', updatePeekClass);

  // input stops events propagation, so that's why
  // we want to duplicate these listeners
  input.addEventListener('keydown', updatePeekClass);
  input.addEventListener('keyup', updatePeekClass);
}
