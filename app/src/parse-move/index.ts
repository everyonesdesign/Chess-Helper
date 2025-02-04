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
import { IMoveTemplate } from '../types';
import {
  isFile,
  isPiece,
  isPromotionPiece,
  isRank,
  matchStringTail,
  sanitizeInput,
} from './parse-move-utils';

export function parseMoveInput(input: string): IMoveTemplate[] {
  const moveString = sanitizeInput(input);

  const regularMoves = parseRegularMoves(moveString);
  if (regularMoves) {
    return regularMoves;
  }

  const castlingMoves = parseCastling(moveString);
  if (castlingMoves) {
    return castlingMoves;
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

type ParseSteps
  = 'PROMOTION_PIECE'
  | 'TO_COORDS'
  | 'FROM_RANK'
  | 'FROM_FILE'
  | 'PIECE'
  | 'FINALIZE';

const PARSE_STEPS: Record<number, ParseSteps> = {
  0: 'PROMOTION_PIECE',
  1: 'TO_COORDS',
  2: 'FROM_RANK',
  3: 'FROM_FILE',
  4: 'PIECE',
  5: 'FINALIZE',
};
const parseStepsLength = Object.keys(PARSE_STEPS).length;

interface ParsingResult {
  promotionPiece?: string;
  toRank: string;
  toFile: string;
  fromRank?: string;
  fromFile?: string;
  piece: string;
  hasBishopConflict: boolean;
}
function parseRegularMoves(moveString: string): IMoveTemplate[] | null {
  const result: ParsingResult = {
    piece: '.',
    toFile: '.',
    toRank: '.',
    hasBishopConflict: false,
  };

  let currentStepIndex = 0;
  let currentCharIndex = 0;
  parsingLoop: while (PARSE_STEPS[currentStepIndex]) {
    const currentChar = moveString[moveString.length - currentCharIndex - 1] as string | undefined;

    parsingSwitch: switch (PARSE_STEPS[currentStepIndex]) {
      case 'PROMOTION_PIECE':
        if (!currentChar) {
          return null;
        } else if (isPromotionPiece(currentChar)) {
          result.promotionPiece = currentChar;
          result.piece = 'p';
        } else {
          currentStepIndex++;
          continue parsingLoop;
        }
        break parsingSwitch;
      case 'TO_COORDS':
        if (!currentChar) {
          return null;
        } else if (isRank(currentChar)) {
          result.toRank = currentChar;
          const nextChar = moveString[moveString.length - currentCharIndex - 2] as string | undefined;
          if (!nextChar) {
            return null;
          } else if (isFile(nextChar)) {
            result.toFile = nextChar;
            currentStepIndex++;
            currentCharIndex += 2; // since we tackled 2 characters at once
            continue parsingLoop;
          } else {
            return null;
          }
        } else {
          return null;
        }
      case 'FROM_RANK':
        if (!currentChar) {
          // Go to FINALIZE step; there's no piece specified hence it's a pawn
          result.piece = 'p';
          currentStepIndex = parseStepsLength - 1;
          continue parsingLoop;
        } else if (isRank(currentChar)) {
          result.fromRank = currentChar;
        } else {
          currentStepIndex++;
          continue parsingLoop;
        }
        break parsingSwitch;
      case 'FROM_FILE':
        if (!currentChar) {
          // Go to FINALIZE step; there's no piece specified hence it's a pawn
          result.piece = 'p';
          currentStepIndex = parseStepsLength - 1;
          continue parsingLoop;
        } else if (isFile(currentChar)) {
          result.fromFile = currentChar;
        } else {
          currentStepIndex++;
          continue parsingLoop;
        }
        break parsingSwitch;
      case 'PIECE':
        if (!currentChar) {
          if (result.fromFile && result.fromRank && !result.promotionPiece) {
            // uci move
            result.piece = '.';
          } else {
            result.piece = 'p';
          }
        } else if (isPiece(currentChar)) {
          if (result.promotionPiece) {
            // Only pawns can be promoted
            return null;
          }
          result.piece = currentChar;
        } else {
          // Unknown piece
          return null;
        }
        break parsingSwitch;
      case 'FINALIZE':
        if (currentChar) {
          // Not a valid expression
          return null;
        } else if (
          (result.piece === 'p' || result.piece === '.') &&
          result.fromFile === 'b' &&
          !result.promotionPiece
        ) {
          result.hasBishopConflict = true;
        }
        break parsingSwitch;
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

  if (result.hasBishopConflict) {
    moves.push({
      to: move.to,
      from: '.' + (move.from as string)[1],
      piece: 'b',
    });
  }

  return moves;
}
