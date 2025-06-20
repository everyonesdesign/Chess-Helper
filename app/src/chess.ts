import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import {
  postMessage,
  squareToCoords,
} from './utils';
import {
  drawCache,
} from './globals';
import {
  getCommandAction,
} from './commands';
import {
  IChessboard,
  TArea,
  TPiece,
  IMoveTemplate,
  IMove,
  TFromTo,
} from './types';
import { parseMoveInput } from './parse-move';
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
  const command = getCommandAction(input);
  if (command && command.isAvailable()) {
    command.act();
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
export function getLegalMoves(board: IChessboard, potentialMoves: IMoveTemplate[]) : IMove[] {
  if (!board || !potentialMoves.length || !board.isPlayersMove()) {
    return [];
  }

  let legalMoves: IMove[] = [];
  potentialMoves.forEach((move) => {
    const toYCoord = squareToCoords(move.to)[1];

    const pieces = board.getPiecesSetup();

    const matchingPieces = filter(pieces, (p) => {
      // Treat promotion moves without "promotionPiece" as invalid
      if (
        p.type === 'p' &&
        [1, 8].includes(toYCoord) &&
        !move.promotionPiece
      ) {
        return false;
      }

      return (
        // RegExp is required, because move.piece/move.from aren't always there
        // It might be just ".", meaning "any piece" (imagine move like "e2e4")
        new RegExp(`^${move.piece}$`).test(p.type) &&
        new RegExp(`^${move.from}$`).test(p.area) &&
        board.isLegalMove(p.area, move.to)
      );
    });

    legalMoves = [
      ...legalMoves,
      ...matchingPieces.map((piece) => ({
        ...move,
        from: <TArea>piece.area,
      })),
    ];
  });

  return excludeConflictingMoves(pickMostSpecificMoves(legalMoves));
}

/**
 * Exclude moves conflicting between each other for whatever reasons
 * (some exceptions)
 */
export function excludeConflictingMoves(moves: IMove[]) : IMove[] {
  const piecesString = moves.map(m => m.piece).sort().join('');
  if (piecesString === 'bp') {
    // Bishop and pawn conflict
    // Bishop is preferred in this case unless pawn captures
    // @see https://github.com/everyonesdesign/Chess-Helper/issues/51
    const pawnMove = moves.find(m => m.piece === 'p') as IMove;
    const bishopMove = moves.find(m => m.piece === 'b') as IMove;
    if (pawnMove.from[0] === pawnMove.to[0]) {
      return [bishopMove];
    }
    return [pawnMove];
  } else if (piecesString === '.b') {
    // Bishop and UCI move conflict
    // UCL is preferred in this case (since multiple bishops sharing same diagonal are extremely rare)
    // @see e2e test "Moves like `b2b4` prefer UCI over a bishop in conflicts"
    const uciMove = moves.find(m => m.piece === '.') as IMove;
    return [uciMove];
  }

  return moves;
}

/**
 * Sometimes returned moves are essentially the same or similar
 * This method omits less specific moves
 * Example1:
 *   Input: [{ piece: '.', from: 'b4', to: 'b5' }, { piece: 'p', from: 'b4', to: 'b5' }]
 *   Output: [{ piece: 'p', from: 'b4', to: 'b5' }]
 */
function pickMostSpecificMoves(moves: IMove[]) : IMove[] {
  const result: IMove[] = [];
  const movesDict: Record<string, IMove> = {};
  moves.forEach(move => {
    if (!movesDict[move.from + move.to]) {
      movesDict[move.from + move.to] = move;
    } else {
      // Override with the most specific piece
      if (movesDict[move.from + move.to].piece === '.' && move.piece !== '.') {
        movesDict[move.from + move.to] = move;
      }
    }
  });
  return Object.values(movesDict);
}
