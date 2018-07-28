const {
  initAnalytics,
  sendLayoutOverlappingStatus,
  sendDataToAnalytics,
} = require('./analytics');
const {
  getMoveCoords,
  parseMove,
  getBoard,
  go,
} = require('./chess');
const {
  holdingCtrlOrCmd,
} = require('./utils');

const KEY_CODES = {
  enter: 13,
  leftArrow: 37,
  topArrow: 38,
  rightArrow: 39,
  bottomArrow: 40,
  escape: 27,
};

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
    input.setAttribute('placeholder', 'Enter move here...');
    input.addEventListener('keydown', handleKeyDown);
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

    // see https://trello.com/c/aT95jsv5
    sendLayoutOverlappingStatus();

    const messages = document.createElement('div');
    messages.setAttribute('id', 'ccHelper-messages');
    messages.className = 'ccHelper-messages';
    document.body.appendChild(messages);
  }
}

/**
 * Handle keyDown event on the input
 * Responsible for submitting move, backward/forward moves, etc.
 * @param  {Event} e
 */
function handleKeyDown(e) {
  const input = e.target;

  if (e.keyCode === KEY_CODES.enter) {
    go(input.value);

    const board = getBoard();
    board && board.clearMarkedArrows();

    sendDataToAnalytics({
      category: 'enter',
      action: 'press',
      label: input.value,
    });

    input.value = '';
    input.focus();
  } else if (e.keyCode === KEY_CODES.escape) {
    input.value = '';

    const board = getBoard();
    board && board.clearMarkedArrows();
  } else if (holdingCtrlOrCmd(e)) {
    if (e.keyCode === KEY_CODES.leftArrow) {
      const selector = '.move-list-buttons .icon-chevron-left, .control-group .icon-chevron-left';
      document.querySelector(selector).parentNode.click();
    } else if (e.keyCode === KEY_CODES.rightArrow) {
      const selector = '.move-list-buttons .icon-chevron-right, .control-group .icon-chevron-right';
      document.querySelector(selector).parentNode.click();
    }
  }
}

init();
