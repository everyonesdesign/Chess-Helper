const get = require('lodash/get');
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
  let cb = (
    // board for training with computer
    get(window, 'myEvent.capturingBoard') ||
  // new live mode
    get(window, 'liveClient.controller.activeBoard.chessboard')
  );


  if (!cb) {
    // legacy old chessboard
    // probably should be removed
    if (window.boardsService && window.boardsService.getSelectedBoard) {
      const activeBoard = window.boardsService.getSelectedBoard();

      if (activeBoard) {
        return activeBoard.chessboard;
      }
    }
  }

  return cb || null;
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

/**
 * Extract all possible information from algebraic notation
 * @param  {String} move
 * @return {Boolean}
 */
function parseAlgebraic(move) {
  // ignore from-to notation
  if (/[a-h][1-8][a-h][1-8]/.test(move)) {
    return;
  }

  const trimmedMove = move.replace(/( |-)+/g, '');

  if (/[o0][o0][o0]/i.test(trimmedMove)) {
    return {
      piece: 'k',
      moveType: 'long-castling',
    };
  } else if (/[o0][o0]/i.test(trimmedMove)) {
    return {
      piece: 'k',
      moveType: 'short-castling',
    };
  }

  const regex = /^([RQKNB])?([a-h])?([1-8])?(x)?([a-h])([1-8])(e\.?p\.?)?[+#]?$/;
  const result = trimmedMove.match(regex);

  if (!result) {
    return null;
  }

  const [
    _, // eslint-disable-line no-unused-vars
    piece,
    fromHor,
    fromVer,
    isCapture,
    toHor,
    toVer,
  ] = result;

  return {
    piece: (piece || 'p').toLowerCase(),
    moveType: isCapture ? 'capture' : 'move',
    from: `${fromHor || '.'}${fromVer || '.'}`,
    to: `${toHor || '.'}${toVer || '.'}`,
  };
}

module.exports = {
  validateSquareName,
  parseMoveText,
  getBoard,
  go,
  makeMove,
  parseAlgebraic,
};
