const get = require('lodash/get');
const filter = require('lodash/filter');
const find = require('lodash/find');
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
    const move = parseMove(input);
    const coords = getMoveCoords(board, move);
    if (coords) {
      makeMove(...coords);
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
 * Get exact from and to coords from move data
 * @param  {ChessBoard} board - ChessBoard instance
 * @param  {Object} move      - object, returned by `parseMove` method
 * @return {Array?}           - array [from, to]
 */
function getMoveCoords(board, move) {
  if (!board || !move) {
    return;
  }

  if (['short-castling', 'long-castling'].includes(move.moveType)) {
    return getCastlingCoords(board, move);
  } else if (['move', 'capture'].includes(move.moveType)) {
    const pieces = get(board, 'gameSetup.pieces', []);

    const matchingPieces = filter(pieces, (p) => {
      return (
        new RegExp(`^${move.piece}$`).test(p.type) &&
        new RegExp(`^${move.from}$`).test(p.area) &&
        board.gameRules.isLegalMove(board.gameSetup, p.area, move.to)
      );
    });

    if (matchingPieces.length === 1) {
      const piece = matchingPieces[0];
      return [piece.area, move.to];
    }
  }

  return null;
}

/**
 * Get coordinates for castling moves (0-0 and 0-0-0)
 * @param  {ChessBoard} board
 * @param  {Object} move
 * @return {Array?} - in the same format as getMoveCoords
 */
function getCastlingCoords(board, move) {
  let moves;
  if (move.moveType === 'short-castling') {
    moves = [['e1', 'g1'], ['e8', 'g8']];
  } else if (move.moveType === 'long-castling') {
    moves = [['e1', 'c1'], ['e8', 'c8']];
  }

  const pieces = get(board, 'gameSetup.pieces', []);
  const legalMoves = moves.filter(([fromSq, toSq]) => {
    return (
      find(pieces, {type: 'k', area: fromSq}) &&
      board.gameRules.isLegalMove(board.gameSetup, fromSq, toSq)
    );
  });

  if (legalMoves.length === 1) {
    return legalMoves[0];
  }

  return null;
}

/**
 * Parse message input by user
 * @param  {String} input
 * @return {Object?} - move data
 */
function parseMove(input) {
  return parseAlgebraic(input) || parseFromTo(input);
}

/**
 * Parse simplest move format: 'e2e4'
 * @param  {String} input
 * @return {Object?}
 */
function parseFromTo(input) {
  const filteredSymbols = input.replace(/( |-)+/g, '');
  const fromSquare = filteredSymbols.slice(0, 2);
  const toSquare = filteredSymbols.slice(2, 4);

  if (validateSquareName(fromSquare) && validateSquareName(toSquare)) {
    return {
      piece: '.',
      from: 'e2',
      to: 'e4',
      moveType: 'move',
    };
  }

  return null;
}

/**
 * Extract all possible information from algebraic notation
 * @param  {String} move
 * @return {Object?}
 */
function parseAlgebraic(move) {
  // ignore from-to notation
  if (/^\s*[a-h][1-8][a-h][1-8]\s*$/.test(move)) {
    return null;
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
  parseMove,
  getBoard,
  go,
  makeMove,
  parseAlgebraic,
  parseFromTo,
  getMoveCoords,
};
