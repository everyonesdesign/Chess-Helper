const {
  sendDataToAnalytics,
} = require('./analytics');
const {
  postMessage,
} = require('./utils');

/**
 * Check if input is valid square name
 * @param  {String} input
 * @return {Boolean}
 */
function validateSquareName(input) {
  return /^[a-h][1-8]$/.test(input);
}

/**
 * Parse message input by user
 * @param  {String} input - input, in format 'e2e4'
 * @return {Array?} - array of two elemens: from and to; or null if there's no move
 */
function parseMoveText(input) {
  const filteredSymbols = input.replace(/( |-)+/g, '');
  const fromSquare = filteredSymbols.slice(0, 2);
  const toSquare = filteredSymbols.slice(2, 4);

  if (validateSquareName(fromSquare) && validateSquareName(toSquare)) {
    return [fromSquare, toSquare];
  }

  return null;
}

/**
 * Get active board instance
 * @return {ChessBoard?}
 */
function getBoard() {
  // board for training with computer
  const computerBoard = window.myEvent.capturingBoard;
  if (computerBoard) {
    return computerBoard;
  }

  // old live mode: probably not working anywhere now
  if (window.boardsService && window.boardsService.getSelectedBoard) {
    const activeBoard = window.boardsService.getSelectedBoard();

    if (activeBoard) {
      return activeBoard.chessboard;
    }
  }

  // new live mode
  const lc = window.liveClient;
  if (
    lc &&
    lc.controller &&
    lc.controller.activeBoard &&
    lc.controller.activeBoard.chessboard
  ) {
    return lc.controller.activeBoard.chessboard;
  }


  return null;
}

/**
 * Handle user input and act in appropriate way
 * The function uses active board on the screen if there's any
 * @param  {String} input - input, in format 'e2e4'
 */
function go(input) {
  const board = getBoard();
  if (board) {
    const move = parseMoveText(input);
    if (move) {
      makeMove(move[0], move[1]);
    } else {
      sendDataToAnalytics({
        category: 'incorrect',
        action: 'input',
        label: input,
      });

      postMessage('Incorrect move: ' + input);
    }
  }
}

/**
 * Check move and make it if it's legal
 * This function relies on chess.com chessboard interface
 * @param  {String} fromField - starting field, e.g. 'e2'
 * @param  {String} toField   - ending field, e.g. 'e4'
 */
function makeMove(fromField, toField) {
  const board = getBoard();
  if (board.gameRules.isLegalMove(board.gameSetup, fromField, toField)) {
      board._clickedPieceElement = fromField;
      board.fireEvent('onDropPiece', {
          fromAreaId: fromField,
          targetAreaId: toField,
      });
  } else {
    const move = fromField + '-' + toField;

    sendDataToAnalytics({
      category: 'illegal',
      action: 'input',
      label: move,
    });

    postMessage('Move "' + move + '" is illegal');
  }
}

module.exports = {
  validateSquareName,
  parseMoveText,
  getBoard,
  go,
  makeMove,
};
