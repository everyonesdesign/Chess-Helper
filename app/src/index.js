const {
  initAnalytics,
  sendLayoutOverlappingStatus,
} = require('./analytics');
const {
  getLegalMoves,
  parseMoveInput,
  getBoard,
} = require('./chess');
const {
  bindInputKeyDown,
  bindInputFocus,
} = require('./keyboard');
const {
  isEditable,
  RED_SQUARE_COLOR,
} = require('./utils');


const markedAreas = [];

/**
 * Prepare the extension code and run
 */
function init() {
  const selector = `
    .main-board .board,
    #chessboard,
    #live-app [class*=board-layout-vertical-component_],
    #chess_com_tactics_board
  `;
  const boardElement = document.querySelector(selector);
  if (boardElement) {
    initAnalytics();

    const input = document.createElement('input');
    input.setAttribute('id', 'ccHelper-input');
    input.className = 'ccHelper-input';
    bindInputKeyDown(input);
    input.addEventListener('input', () => {
      const board = getBoard();
      const parseResults = parseMoveInput(input.value);
      const moves = getLegalMoves(board, parseResults);

      if (board) {
        board.clearMarkedArrows();
        while (markedAreas.length) {
          const area = markedAreas.pop();
          board.unmarkArea(area);
        }
        if (moves.length === 1) {
          board.markArrow(...moves[0]);
        } else if (moves.length > 1) {
          moves.forEach((m) => {
            markedAreas.push(m[0]);
            board.markArea(m[0], RED_SQUARE_COLOR);
          });
        }
      }
    });
    boardElement.appendChild(input);

    bindInputFocus(input);

    updatePlaceholder(input);
    setImmediate(() => input.focus());

    document.addEventListener('focusin', () => updatePlaceholder(input));
    document.addEventListener('focusout', () => updatePlaceholder(input));

    // see https://trello.com/c/aT95jsv5
    sendLayoutOverlappingStatus();

    const messages = document.createElement('div');
    messages.setAttribute('id', 'ccHelper-messages');
    messages.className = 'ccHelper-messages';
    document.body.appendChild(messages);
  }
}

/**
 * Handle focusin/focusout events on page
 * to show relevant placeholder in the input
 * @param  {Element} input
 */
function updatePlaceholder(input) {
  const active = document.activeElement;
  if (active === input) {
    input.placeholder = 'Enter your move...';
  } else if (isEditable(active)) {
    input.placeholder = 'Press Esc + C to focus move field...';
  } else {
    input.placeholder = 'Press C to focus move field...';
  }
}

init();
