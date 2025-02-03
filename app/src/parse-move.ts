/**
 * MOVE characters parsed by this module, parsing goes from last character backwards
 * First, check if it's a castling move, handle separately
 *
 * Reverse input, and go character by character:
 * [1] if (is [bnrqBNRQ]) - write promotionPiece, next
 * [2] if (is [1-8]) - write toRank, next; otherwise return empty
 * [3] if (is [a-h]) - write toFile, next; otherwise return empty
 * [4] if (is [1-8]) - write fromRank, next
 * [5] if (is [a-h]) - write fromFile, next
 * [6] if (is [bknrqBKNRQ]) - write piece, done
 * [7] if (no character) - mark as successful move recognition
 *
 * if (has promotion and has piece) - return empty
 * if (starts with b\d) - return 2 moves, one for pawn and one for bishop
 */
import { IMoveTemplate } from './types';

export function parseMoveInput(input: string): IMoveTemplate[] {
  const moveString = sanitizeInput(input);

  const castlingMoves = parseCastling(moveString);
  if (castlingMoves) {
    return castlingMoves;
  }

  const regularMoves = parseRegularMoves(moveString);
  if (regularMoves) {
    return regularMoves;
  }

  return [];
}

function parseCastling(input: string): IMoveTemplate[] | null {
  if (/^[o0][o0][o0]$/i.test(input)) {
    return [
      // white long castling
      {
        piece: 'k',
        from: 'e1',
        to: 'c1',
      },
      // black long castling
      {
        piece: 'k',
        from: 'e8',
        to: 'c8',
      }
    ];
  } else if (/^[o0][o0]$/i.test(input)) {
    return [
      // white short castling
      {
        piece: 'k',
        from: 'e1',
        to: 'g1',
      },
      // black short castling
      {
        piece: 'k',
        from: 'e8',
        to: 'g8',
      }
    ];
  }

  return null;
}

const PARSE_STEPS = [
  'PROMOTION_PIECE',
  'TO_RANK',
  'TO_FILE',
  'FROM_RANK',
  'FROM_FILE',
  'PIECE',
  'FINALIZE',
] as const;
interface ParsingResult {
  promotionPiece?: string;
  toRank: string;
  toFile: string;
  fromRank?: string;
  fromFile?: string;
  piece: string;
  isPawnAndBishopCollision: boolean;
}
function parseRegularMoves(moveString: string): IMoveTemplate[] | null {
  debugger;
  const result: ParsingResult = {
    piece: '.',
    toFile: '.',
    toRank: '.',
    isPawnAndBishopCollision: false,
  };

  let currentStepIndex = 0;
  let currentCharIndex = 0;
  while (PARSE_STEPS[currentStepIndex]) {
    const currentChar = moveString[moveString.length - currentCharIndex - 1];
    if (PARSE_STEPS[currentStepIndex] ==='PROMOTION_PIECE') {
      if (/^[bnrqBNRQ]$/.test(currentChar)) {
        result.promotionPiece = currentChar;
        result.piece = 'p';
      } else {
        currentStepIndex++;
        continue;
      }
    } else if (PARSE_STEPS[currentStepIndex] === 'TO_RANK') {
      if (/^[1-8]$/.test(currentChar)) {
        result.toRank = currentChar;
      } else {
        return null;
      }
    } else if (PARSE_STEPS[currentStepIndex] === 'TO_FILE') {
      if (/^[a-h]$/.test(currentChar)) {
        result.toFile = currentChar;
      } else {
        return null;
      }
    } else if (PARSE_STEPS[currentStepIndex] === 'FROM_RANK') {
      if (/^[1-8]$/.test(currentChar)) {
        result.fromRank = currentChar;
      } else {
        currentStepIndex++;
        continue;
      }
    } else if (PARSE_STEPS[currentStepIndex] === 'FROM_FILE') {
      if (/^[a-h]$/.test(currentChar)) {
        result.fromFile = currentChar;
      } else {
        currentStepIndex++;
        continue;
      }
    } else if (PARSE_STEPS[currentStepIndex] === 'PIECE') {
      if (/^[bknrqBKNRQ]$/.test(currentChar)) {
        if (result.promotionPiece) {
          // Only pawns can be promoted
          return null;
        }
        result.piece = currentChar;
      } else if (!currentChar) {
        if (result.fromFile && result.fromRank && !result.promotionPiece) {
          // uci move
          result.piece = '.';
        } else {
          result.piece = 'p';
        }
      } else {
        // Unknown piece
        return null;
      }
    } else if (PARSE_STEPS[currentStepIndex] === 'FINALIZE') {
      if (currentChar !== undefined) {
        // Not a valid expression
        return null;
      } else if (
        (result.piece === 'p' || result.piece === '.') &&
        result.fromFile === 'b' &&
        !result.promotionPiece
      ) {
        result.isPawnAndBishopCollision = true;
      }
    }

    currentStepIndex++;
    currentCharIndex++;
  }

  const move: IMoveTemplate = {
    piece: result.piece.toLowerCase(),
    to: result.toFile + result.toRank,
    from: (result.fromFile || '.') + (result.fromRank || '.'),
  }

  if (result.promotionPiece) {
    move.promotionPiece = result.promotionPiece.toLowerCase();
  }

  const moves: IMoveTemplate[] = [move];

  if (result.isPawnAndBishopCollision) {
    moves.push({
      ...move,
      from: '.' + (move.from as string)[1],
      piece: 'b',
    });
  }

  return moves;
}

function sanitizeInput(moveString: string) : string {
  // Remove spaces, captures, check, mate, and supplemental promotion and castling characters
  return moveString.replace(/[\sx#\+\-]/g, '');
}
