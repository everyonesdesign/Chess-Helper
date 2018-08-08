const {
  initAnalytics,
  sendLayoutOverlappingStatus,
} = require('./analytics');
const {
  getBoard,
  drawMovesOnBoard,
} = require('./chess');
const {
  bindInputKeyDown,
  bindInputFocus,
} = require('./keyboard');
const {
  isEditable,
  buildMessagesMarkup,
  createInitialElements,
} = require('./utils');
const {
  boardsCallbacks,
} = require('./globals');


/**
 * Prepare the extension code and run
 */
function init() {
  const selector = `
    .analysis-diagram .chess_viewer,
    .main-board .board,
    #chessboard,
    #live-app [class*=board-layout-vertical-component_],
    #chess_com_tactics_board
  `;
  const boardElement = document.querySelector(selector);
  if (boardElement) {
    initAnalytics();

    const {
      wrapper,
      input,
      unfocusedLabel,
    } = createInitialElements();

    bindInputKeyDown(input);
    bindInputFocus(input);
    boardElement.appendChild(wrapper);
    setImmediate(() => input.focus());

    input.addEventListener('input', () => {
      try {
        const board = getBoard();
        const draw = () => drawMovesOnBoard(board, input.value);
        draw();

        if (!boardsCallbacks.get(board)) {
          // bind redraws on certain events
          // (if it's not bound yet)
          const events = [
            board.attachEvent('onDropPiece', draw),
            board.attachEvent('onAfterMoveAnimated', draw),
            board.attachEvent('onRefresh', draw),
          ];
          boardsCallbacks.set(board, events);
        }
      } catch (e) {
        console.error(e);
      }
    });

    updatePlaceholder(input, unfocusedLabel);
    ['focusin', 'focusout'].forEach((e) => {
      document.addEventListener(
        e,
        () => updatePlaceholder(input, unfocusedLabel)
      );
    });

    // see https://trello.com/c/aT95jsv5
    sendLayoutOverlappingStatus();

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
 * @param  {Element} input
 * @param  {Element} unfocusedLabel
 */
function updatePlaceholder(input, unfocusedLabel) {
  const active = document.activeElement;

  if (isEditable(active)) {
    unfocusedLabel.textContent = 'Press Esc + C to focus move field...';
  } else {
    unfocusedLabel.textContent = 'Press C to focus move field...';
  }
}

init();
