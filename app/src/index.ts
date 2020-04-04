import map from 'lodash/map';
import {
  drawMovesOnBoard,
} from './chess';
import {
  getBoard,
} from './chessboard';
import {
  bindInputKeyDown,
  bindInputFocus,
  bindBlindFoldPeek,
} from './keyboard';
import {
  isEditable,
  buildMessagesMarkup,
  createInitialElements,
  startUpdatingAriaHiddenElements,
  initBlindFoldOverlay,
} from './utils';
import {
  commands,
} from './commands';
import autocomplete from './lib/autocomplete';


/**
 * Prepare the extension code and run
 */
function init() {
  const selector = `
    .analysis-diagram .chess_viewer,
    .main-board .board,
    #chessboard,
    #live-app .main-board-component,
    #chess_com_tactics_board,
    #board-layout-main,
    [id^=chess_com_chessmentor_board_]
  `;
  const boardElement = document.querySelector(selector);
  if (boardElement) {
    const {
      wrapper,
      input,
      unfocusedLabel,
    } = createInitialElements();

    bindInputKeyDown(input);
    bindInputFocus(input);
    boardElement.appendChild(wrapper);
    setTimeout(() => input.focus());

    autocomplete({
      selector: '.ccHelper-input',
      minChars: 1,
      source: (term, suggest) => {
        term = term.toLowerCase();
        const choices = map(commands, (v, k) => `/${k}`);
        suggest(choices.filter((choice) => !choice.toLowerCase().indexOf(term)));
      },
    });

    startUpdatingAriaHiddenElements();
    bindBlindFoldPeek(input);

    document.addEventListener('ccHelper-draw', () => {
      const board = getBoard();
      if (board) {
        drawMovesOnBoard(board, input.value);
      }
    });

    input.addEventListener('input', () => {
      try {
        const board = getBoard();

        if (board) {
          drawMovesOnBoard(board, input.value);
          initBlindFoldOverlay(board);
        }
      } catch (e) {
        console.error(e);
      }
    });

    updatePlaceholder(unfocusedLabel);
    ['focusin', 'focusout'].forEach((e) => {
      document.addEventListener(
        e,
        () => updatePlaceholder(unfocusedLabel)
      );
    });

    buildMessagesMarkup();
  }
}

/**
 * Handle focusin/focusout events on page
 * to show relevant placeholder in the input
 *
 * Unfocused placeholder is synthesised by
 * an additional element for a11y reasons
 * (to keep placeholder in the same state always)
 *
 * @param  {Element} unfocusedLabel
 */
function updatePlaceholder(unfocusedLabel: HTMLElement) {
  const active = document.activeElement;

  if (isEditable(active)) {
    unfocusedLabel.textContent = 'Press Esc + C to focus move field...';
  } else {
    unfocusedLabel.textContent = 'Press C to focus move field...';
  }
}

init();
