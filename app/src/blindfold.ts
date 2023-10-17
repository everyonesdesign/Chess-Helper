import domify from 'domify';
import {
  blindFoldIcon,
} from './icons';
import {
  blindfoldOverlays,
} from './globals';
import {
  Nullable,
  IChessboard,
} from './types';
import {
  getBoard,
} from './chessboard';
import {
  EXTENTION_INITED_HEAD_CLASSNAME,
} from './utils';
import { i18n } from './i18n';

const BLINDFOLD_STORAGE_KEY = 'ccHelper-blindfold';
const BLINDFOLD_ENABLED_VALUE = '1';

// document.body class to toggle the blindfold mode
export const BLINDFOLD_BODY_CLASSNAME = 'ccHelper-docBody--blindfolded';
// document.head class to toggle the blindfold mode (needed for early rendering tricks)
export const BLINDFOLD_HEAD_CLASSNAME = 'ccHelper-docHead--blindfolded';

function isBlindfoldModeEnabled() : boolean {
  const value = localStorage.getItem(BLINDFOLD_STORAGE_KEY);
  return value === BLINDFOLD_ENABLED_VALUE;
}

function setBlindfoldModeState(state : boolean) : void {
  localStorage.setItem(BLINDFOLD_STORAGE_KEY, state ? '1' : '0');
  renderBlindfold();
}

export function toggleBlindfoldMode() : void {
  const isEnabled = isBlindfoldModeEnabled();
  setBlindfoldModeState(!isEnabled);
}

export function renderBlindfold() : void {
  const isEnabled = isBlindfoldModeEnabled();
  const method = isEnabled ? 'add' : 'remove';

  if (document.body) {
    document.body.classList[method](BLINDFOLD_BODY_CLASSNAME);
  }

  if (document.head) {
    document.head.classList[method](BLINDFOLD_HEAD_CLASSNAME);
  }

  if (isEnabled) {
    const inited = document.head.classList.contains(EXTENTION_INITED_HEAD_CLASSNAME);

    if (inited) {
      const board = getBoard();
      board && initBlindFoldOverlay(board);
    }
  }
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
                  key: '<span class="ccHelper-blindfoldKey">Ctrl</span>',
                  toggleKey: '<span class="ccHelper-blindfoldKey">Ctrl+b</span>'
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
          button.addEventListener('click', toggleBlindfoldMode);
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
