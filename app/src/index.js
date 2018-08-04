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
} = require('./utils');


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

    const input = document.createElement('input');
    input.setAttribute('id', 'ccHelper-input');
    input.className = 'ccHelper-input';
    bindInputKeyDown(input);
    bindInputFocus(input);
    boardElement.appendChild(input);
    setImmediate(() => input.focus());

    let redrawInterval = null;
    input.addEventListener('input', () => {
      try {
        clearInterval(redrawInterval);
        const board = getBoard();
        const draw = () => drawMovesOnBoard(board, input);
        draw();
        setInterval(draw, 500);
      } catch (e) {
        console.error(e);
      }
    });

    updatePlaceholder(input);
    document.addEventListener('focusin', () => updatePlaceholder(input));
    document.addEventListener('focusout', () => updatePlaceholder(input));

    // see https://trello.com/c/aT95jsv5
    sendLayoutOverlappingStatus();

    buildMessagesMarkup();
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
