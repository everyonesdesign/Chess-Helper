const {
  initAnalytics,
  sendLayoutOverlappingStatus,
} = require('./analytics');
const {
  getMoveCoords,
  parseMove,
  getBoard,
} = require('./chess');
const {
  bindInputKeyDown,
  bindInputFocus,
} = require('./keyboard');
const {
  isEditable,
} = require('./utils');

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
      const move = parseMove(input.value);
      const coords = getMoveCoords(board, move);

      if (board) {
        board.clearMarkedArrows();
        coords && board.markArrow(...coords);
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
