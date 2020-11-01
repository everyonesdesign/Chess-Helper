import domify from 'domify';
import {
  ariaHiddenElements,
  blindfoldOverlays,
} from './globals';
import {
  blindFoldIcon,
} from './icons';
import {
  commands,
} from './commands';
import {
  IChessboard,
  TArea,
  Nullable,
  IConfig,
} from './types';
import { i18n } from './i18n';

// value is stored inside of chessboard.rightClickMarkColors
export const RED_SQUARE_COLOR = '#f42a32';

export function combineStringArrays(a: string[], b: string[]) : string[] {
  const combinations = [];

  for(var i = 0; i < a.length; i++) {
       for(var j = 0; j < b.length; j++) {
          combinations.push(`${a[i]}${b[j]}`)
       }
  }

  return combinations;
}

export const ALL_FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ALL_RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const ALL_AREAS: TArea[] = combineStringArrays(ALL_FILES, ALL_RANKS);

/**
 * Is user holding Ctrl (on PC) or Cmd (on Mac)
 */
export function holdingCtrlOrCmd(e: KeyboardEvent) {
  if (navigator.platform === 'MacIntel') {
    return e.metaKey;
  }

  return e.ctrlKey;
}

/**
 * Write some message to the user
 */
export function postMessage(text: string) {
  const messagesContainer = document.getElementById('ccHelper-messages');

  if (messagesContainer) {
    const message = document.createElement('div');
    message.className = 'ccHelper-messagesItem';
    message.textContent = text;
    messagesContainer.appendChild(message);

    setTimeout(() => {
      messagesContainer.removeChild(message);
    }, 3000);
  }
}

/**
 * Text if passed element can take some text input
 */
export function isEditable(element: Nullable<Element>) : boolean {
  if (element) {
    return element.matches('input, textarea, [contenteditable]');
  }

  return false;
}

/**
 * Build basic markup for notification showing
 */
export function buildMessagesMarkup() {
  const messages = document.createElement('div');
  messages.setAttribute('id', 'ccHelper-messages');
  messages.className = 'ccHelper-messages';
  document.body.appendChild(messages);
}

/**
 * Is modifier key pressed during keydown
 * (ctrl/shift/meta/alt)
 */
export function isModifierPressed(e: KeyboardEvent) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
}

/**
 * Provide initial elements for the app
 */
export function createInitialElements() {
  const wrapper = domify(`
    <div class="ccHelper-wrapper">
      <input
        type="text"
        class="ccHelper-input"
        id="ccHelper-input"
        placeholder="${i18n('inputHint')}"
      >
      <div class="ccHelper-label" aria-hidden="true"></div>
    </div>
  `);
  const input = <HTMLInputElement>wrapper.querySelector('#ccHelper-input');
  const unfocusedLabel = <HTMLElement>wrapper.querySelector('.ccHelper-label');

  return {
    wrapper,
    input,
    unfocusedLabel,
  };
}

/**
 * Chessboard markup is a mess
 * This function hides it from screen readers
 */
export function startUpdatingAriaHiddenElements() {
  const update = () => {
    const elements = Array.from(document.querySelectorAll('.chessboard'));
    elements.forEach((element) => {
      if (!ariaHiddenElements.get(element)) {
        element.setAttribute('aria-hidden', 'true');
        ariaHiddenElements.set(element, true);
      }
    });
  };

  update();
  setInterval(update, 1000);
}

/**
 * Create a blindfold overlay for a board element
 */
export function initBlindFoldOverlay(board: IChessboard) {
  const existingOverlay = blindfoldOverlays.get(board);
  if (!existingOverlay) {
    const container = board.getRelativeContainer();
    if (container) {
      if (container) {
        const overlay = domify(`
          <div class="ccHelper-blindfold">
            <div class="ccHelper-blindfoldPeek">
              <div class="ccHelper-blindfoldPeekContents">
                ${i18n('blindFoldPeekHint', {
                  key: '<span class="ccHelper-blindfoldKey">Ctrl</span>'
                })}
              </div>
            </div>
            <div class="ccHelper-blindfoldBackground"></div>
            <div class="ccHelper-blindfoldTitle">
              ${i18n('blindFoldOn')}
            </div>
            ${blindFoldIcon}
            <button class="ccHelper-blindfoldButton">
              ${i18n('blindfoldToggleHint')}
            </button>
          </div>
        `);

        // toggle blindfold mode on button click...
        const button = overlay.querySelector('.ccHelper-blindfoldButton');
        if (button) {
          button.addEventListener('click', () => commands.blindfold());
        }

        blindfoldOverlays.set(board, overlay);
        container.appendChild(overlay);
      } else {
        // maybe set some dummy value to `blindfoldOverlays` set
        // to optimise this function?
      }
    }
  }
}

/**
 * Translate square string to coords
 */
export function squareToCoords(square: TArea) : number[] {
  const hor = 'abcdefgh'.indexOf(square[0]) + 1;
  const ver = Number(square[1]);
  return [hor, ver];
}

/**
 * Translate coords string to square
 */
export function coordsToSquare(coords: string) : TArea {
  const numbers = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return numbers[Number(coords.slice(1, 2))] + coords.slice(3, 4);
}

export function getConfig() : IConfig {
  return (<any>window).chessHelper__environment;
}
