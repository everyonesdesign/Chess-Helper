const filter = require('lodash/filter');
const find = require('lodash/find');
const {
  sendDataToAnalytics,
} = require('./analytics');
const {
  postMessage,
} = require('./utils');
const {
  drawCache,
} = require('./globals');
const {
  parseCommand,
} = require('./commands');
const {
  getBoard,
} = require('./chessboard');

/**
 * Check if input is valid square name
 * @param  {String} input
 * @return {Boolean}
 */
function validateSquareName(input) {
  return /^[a-h][1-8]$/.test(input);
}

/**
 * Draw all needed arrows and marks on the board
 * Note that drawing is async,
 * otherwise it can be triggered during opponent's move
 * @param {ChessBoard} board
 * @param {String} inputText
 */
function drawMovesOnBoard(board, inputText) {
  setImmediate(() => {
    const parseResults = parseMoveInput(inputText);
    const moves = getLegalMoves(board, parseResults);

    if (board) {
      clearBoardDrawings(board);

      if (moves.length === 1) {
        const move = moves[0];
        board.markArrow(...move);
        drawCache.set(board, {
          arrows: [[move[0], move[1]]],
          areas: [],
        });
      } else if (moves.length > 1) {
        drawCache.set(board, {
          arrows: [],
          areas: moves.map((m) => {
            board.markArea(m[0]);
            return m[0];
          }),
        });
      }
    }
  });
}

/**
 * Clear all arrows and markings
 * @param {ChessBoard} board
 */
function clearBoardDrawings(board) {
  const cache = drawCache.get(board) || {
    areas: [],
    arrows: [],
  };
  cache.arrows.forEach((a) => board.unmarkArrow(a[0], a[1]));
  cache.areas.forEach((area) => board.unmarkArea(area));
  drawCache.set(board, {
    areas: [],
    arrows: [],
  });
}

/**
 * Handle user input and act in appropriate way
 * The function uses active board on the screen if there's any
 * @param  {String} input - input, in format 'e2e4'
 * @return {Boolean} if the move was successfully consumed
 */
function go(input) {
  const board = getBoard();
  if (board) {
    const command = parseCommand(input);
    if (command) {
      command();
      return true;
    }

    const parseResult = parseMoveInput(input);
    const moves = getLegalMoves(board, parseResult);
    if (moves.length === 1) {
      const move = moves[0];
      makeMove(...move);

      if (move[2]) {
        makePromotion(move[2]);
      }

      return true;
    } else if (moves.length > 1) {
      sendDataToAnalytics({
        category: 'ambiguous',
        action: 'input',
        label: input,
      });

      postMessage('Ambiguous move: ' + input);
    } else {
      sendDataToAnalytics({
        category: 'incorrect',
        action: 'input',
        label: input,
      });

      postMessage('Incorrect move: ' + input);
    }
  }

  return false;
}

/**
 * Check move and make it if it's legal
 * This function relies on chess.com chessboard interface
 * @param  {String} fromField - starting field, e.g. 'e2'
 * @param  {String} toField   - ending field, e.g. 'e4'
 */
function makeMove(fromField, toField) {
  const board = getBoard();
  if (board.isLegalMove(fromField, toField)) {
      board._clickedPieceElement = fromField;
      board.makeMove(fromField, toField);
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
 * Make a promotion
 * Needs promotion window to be open
 * @param  {String} pieceType - what we want the piece to be? q|r|n|b
 */
function makePromotion(pieceType) {
  const style = document.createElement('style');
  style.id='chessHelper__hidePromotionArea';
  style.innerHTML = '.promotion-area {opacity: .0000001}';
  document.body.appendChild(style);

  /**
   * Click element asynchronously
   * because otherwise the promotion area won't be in time to be shown
   */
  setTimeout(function() {
    const promotionArea = document.querySelector('.promotion-area');
    if (promotionArea && promotionArea.style.display !== 'none') {
      const target = promotionArea.querySelector(`[piece="${pieceType}"]`);
      target && target.click();
    }

    style.parentNode.removeChild(style);
  }, 50);
}

/**
 * Get exact from and to coords from move data
 * @param  {ChessBoard} board - ChessBoard instance
 * @param  {Object} move      - object, returned by `parseMoveInput` method
 * @return {Array}            - array [[from, to]?]
 */
function getLegalMoves(board, move) {
  if (!board || !move || !board.isPlayersMove()) {
    return [];
  }

  if (['short-castling', 'long-castling'].includes(move.moveType)) {
    return getLegalCastlingMoves(board, move);
  } else if (['move', 'capture'].includes(move.moveType)) {
    const pieces = board.getPiecesSetup();

    const matchingPieces = filter(pieces, (p) => {
      return (
        new RegExp(`^${move.piece}$`).test(p.type) &&
        new RegExp(`^${move.from}$`).test(p.area) &&
        board.isLegalMove(p.area, move.to)
      );
    });

    return matchingPieces.map((piece) => {
      const coords = [piece.area, move.to];

      if (move.promotionPiece) {
        coords.push(move.promotionPiece);
      }

      return coords;
    });
  }

  return [];
}

/**
 * Get coordinates for castling moves (0-0 and 0-0-0)
 * @param  {ChessBoard} board
 * @param  {Object} move
 * @return {Array} array [[from, to]?]
 */
function getLegalCastlingMoves(board, move) {
  let moves;
  if (move.moveType === 'short-castling') {
    moves = [['e1', 'g1'], ['e8', 'g8']];
  } else if (move.moveType === 'long-castling') {
    moves = [['e1', 'c1'], ['e8', 'c8']];
  }

  const pieces = board.getPiecesSetup();
  const legalMoves = moves.filter(([fromSq, toSq]) => {
    return (
      find(pieces, {type: 'k', area: fromSq}) &&
      board.isLegalMove(fromSq, toSq)
    );
  });

  if (legalMoves.length === 1) {
    return [legalMoves[0]];
  }

  return [];
}

/**
 * Parse message input by user
 * @param  {String} input
 * @return {Object?} - move data
 */
function parseMoveInput(input) {
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
      from: fromSquare,
      to: toSquare,
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

  const trimmedMove = move.replace(/[\s\-\(\)]+/g, '');

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

  const regex = /^([RQKNB])?([a-h])?([1-8])?(x)?([a-h])([1-8])(e\.?p\.?)?(=[QRNBqrnb])?[+#]?$/;
  const result = trimmedMove.match(regex);

  if (!result) {
    return null;
  }

  const [
    _, // eslint-disable-line no-unused-vars
    pieceName,
    fromHor,
    fromVer,
    isCapture,
    toHor,
    toVer,
    ep, // eslint-disable-line no-unused-vars
    promotion,
  ] = result;

  const piece = (pieceName || 'p').toLowerCase();
  const data = {
    piece,
    moveType: isCapture ? 'capture' : 'move',
    from: `${fromHor || '.'}${fromVer || '.'}`,
    to: `${toHor || '.'}${toVer || '.'}`,
  };

  if (promotion && piece === 'p') {
    data.promotionPiece = promotion[1].toLowerCase();
  }

  return data;
}

module.exports = {
  drawMovesOnBoard,
  validateSquareName,
  parseMoveInput,
  getBoard,
  go,
  makeMove,
  parseAlgebraic,
  parseFromTo,
  getLegalMoves,
  makePromotion,
};
