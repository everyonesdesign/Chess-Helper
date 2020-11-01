import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import {
  postMessage,
} from './utils';
import {
  drawCache,
} from './globals';
import {
  parseCommand,
} from './commands';
import {
  getBoard,
} from './chessboard';
import {
  IChessboard,
  TArea,
  TPiece,
  IMoveTemplate,
  IMove,
  TFromTo,
  TMoveType,
  Nullable,
} from './types';
import { i18n } from './i18n';

/**
 * Check if input is valid square name
 */
export function validateSquareName(input: string) : boolean {
  return /^[a-h][1-8]$/.test(input);
}

const emptyDrawCache : { arrows: TFromTo[], areas: TArea[] } = {
  arrows: [],
  areas: [],
};

/**
 * Draw all needed arrows and marks on the board
 * Note that drawing is async,
 * otherwise it can be triggered during opponent's move
 */
export function drawMovesOnBoard(board: IChessboard, inputText: string) : void {
  if (!board) {
    return;
  }

  setTimeout(() => {
    const parseResults = parseMoveInput(inputText);
    const moves = getLegalMoves(board, parseResults);

    const prevState = drawCache.get(board) || emptyDrawCache;
    let newState = emptyDrawCache;

    if (moves.length === 1) {
      const move = moves[0];
      newState = {
        arrows: [[move.from, move.to]],
        areas: [],
      };
    } else if (moves.length > 1) {
      newState = {
        arrows: [],
        areas: moves.map((m) => {
          return m.from;
        }),
      };
    }

    if (isEqual(prevState, newState)) {
      return;
    }

    // unmark old aread
    prevState.arrows.forEach((arrow: TFromTo) => board.unmarkArrow(...arrow));
    prevState.areas.forEach((area: TArea) => board.unmarkArea(area));

    // draw new ones
    newState.arrows.forEach((arrow: TFromTo) => board.markArrow(...arrow));
    newState.areas.forEach((area: TArea) => board.markArea(area));

    drawCache.set(board, newState);
  });
}

/**
 * Handle user input and act in appropriate way
 * The function uses active board on the screen if there's any
 */
export function go(board: IChessboard, input: string) : boolean {
  const command = parseCommand(input);
  if (command) {
    command();
    return true;
  }

  const parseResult = parseMoveInput(input);
  const moves = getLegalMoves(board, parseResult);
  if (moves.length === 1) {
    const move = moves[0];
    makeMove(board, move.from, move.to, move.promotionPiece);

    return true;
  } else if (moves.length > 1) {
    postMessage(i18n('ambiguousMove', { move: input }));
  } else {
    postMessage(i18n('incorrectMove', { move: input }));
  }

  return false;
}

/**
 * Check move and make it if it's legal
 * This function relies on chess.com chessboard interface
 */
export function makeMove(
  board: IChessboard,
  fromField: TArea,
  toField: TArea,
  promotionPiece?: TPiece,
) {
  if (board.isLegalMove(fromField, toField)) {
      board.makeMove(fromField, toField, promotionPiece);
      try {
        board.submitDailyMove();
      } catch(e) {
        console.log(e);
      }
  } else {
    const move = fromField + '-' + toField;
    postMessage(i18n('illegalMove', { move }));
  }
}

/**
 * Get exact from and to coords from move data
 */
export function getLegalMoves(board: IChessboard, move: Nullable<IMoveTemplate>) : IMove[] {
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
      return {
        ...move,
        from: <TArea>piece.area,
      };
    });
  }

  return [];
}

/**
 * Get coordinates for castling moves (0-0 and 0-0-0)
 */
function getLegalCastlingMoves(board: IChessboard, move: IMoveTemplate) : IMove[] {
  let moves;
  if (move.moveType === 'short-castling') {
    moves = [
      { piece: 'k', from: 'e1', to: 'g1', moveType: 'castling' },
      { piece: 'k', from: 'e8', to: 'g8', moveType: 'castling' },
    ];
  } else if (move.moveType === 'long-castling') {
    moves = [
      { piece: 'k', from: 'e1', to: 'c1', moveType: 'castling' },
      { piece: 'k', from: 'e8', to: 'c8', moveType: 'castling' },
    ];
  }

  if (!moves) {
    return [];
  }

  const pieces = board.getPiecesSetup();
  const legalMoves = moves.filter(({ from , to }) => {
    return (
      find(pieces, {type: 'k', area: from}) &&
      board.isLegalMove(from, to)
    );
  });

  if (legalMoves.length === 1) {
    return [legalMoves[0]];
  }

  return [];
}

/**
 * Parse message input by user
 */
export function parseMoveInput(input: string) : Nullable<IMoveTemplate> {
  return parseAlgebraic(input) || parseUCI(input);
}

/**
 * Parse simplest move format: 'e2e4'
 */
export function parseUCI(input: string) : Nullable<IMoveTemplate> {
  const filteredSymbols = input.replace(/( |-)+/g, '');
  const fromSquare = <TArea>filteredSymbols.slice(0, 2);
  const toSquare = <TArea>filteredSymbols.slice(2, 4);
  const promotion = <TPiece>filteredSymbols.slice(4, 5);

  if (validateSquareName(fromSquare) && validateSquareName(toSquare)) {
    const result: IMoveTemplate = {
      piece: '.',
      from: fromSquare,
      to: toSquare,
      moveType: 'move',
    };

    if (promotion) {
      result.promotionPiece = promotion;
    }

    return result;
  }

  return null;
}

/**
 * Extract all possible information from algebraic notation
 */
export function parseAlgebraic(input: string) : Nullable<IMoveTemplate> {
  // ignore UCI notation
  if (/^\s*[a-h][1-8][a-h][1-8][rqknb]?\s*$/.test(input)) {
    return null;
  }

  const trimmedMove = input.replace(/[\s\-\(\)]+/g, '');

  if (/[o0][o0][o0]/i.test(trimmedMove)) {
    return {
      piece: 'k',
      moveType: 'long-castling',
      to: '',
    };
  } else if (/[o0][o0]/i.test(trimmedMove)) {
    return {
      piece: 'k',
      moveType: 'short-castling',
      to: '',
    };
  }

  const regex = /^([RQKNB])?([a-h])?([1-8])?(x)?([a-h])([1-8])(e\.?p\.?)?(=[QRNBqrnb])?[+#]?$/;
  const result = trimmedMove.match(regex);

  if (!result) {
    return null;
  }

  const [
    _,
    pieceName,
    fromHor,
    fromVer,
    isCapture,
    toHor,
    toVer,
    enPassant,
    promotion,
  ] = result;

  const piece = <TPiece>(pieceName || 'p').toLowerCase();
  const move : IMoveTemplate = {
    piece,
    moveType: <TMoveType>(isCapture ? 'capture' : 'move'),
    from: <TArea>`${fromHor || '.'}${fromVer || '.'}`,
    to: <TArea>`${toHor || '.'}${toVer || '.'}`,
  };

  if (promotion && piece === 'p') {
    move.promotionPiece = <TPiece>promotion[1].toLowerCase();
  }

  return move;
}
