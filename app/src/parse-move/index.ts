import { IMoveTemplate } from '../types';
import {
  matchTail,
  MatchData,
  sanitizeInput,
} from './parse-move-utils';
import {
  FIELDS,
  FILES,
  PIECES,
  PROMOTION_PIECES,
  RANKS,
} from './parse-move-constants';

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
  | 'PIECE';

const PARSE_STEPS: Record<number, ParseSteps> = {
  0: 'PROMOTION_PIECE',
  1: 'TO_COORDS',
  2: 'FROM_RANK',
  3: 'FROM_FILE',
  4: 'PIECE',
};
const parseStepsLength = Object.keys(PARSE_STEPS).length;

interface ParsingResult {
  promotionPiece?: string;
  to: string;
  fromRank?: string;
  fromFile?: string;
  piece: string;
  hasBishopConflict: boolean;
}

/**
 * Parsing chess moves input going from the tail
 */
function parseRegularMoves(moveString: string): IMoveTemplate[] | null {
  const data: MatchData = {
    toProcess: moveString,
    lastMatch: '',
  }
  const result: ParsingResult = {
    piece: '.',
    to: '..',
    hasBishopConflict: false,
  };

  // Handy for local usage
  const match = matchTail.bind(null, data);

  let currentStepIndex = 0;
  parsingLoop: while (PARSE_STEPS[currentStepIndex]) {
    parsingSwitch: switch (PARSE_STEPS[currentStepIndex]) {
      case 'PROMOTION_PIECE':
        if (!data.toProcess.length) {
          return null;
        } else {
          if (match(PROMOTION_PIECES)) {
            result.promotionPiece = data.lastMatch;
            result.piece = 'p';
          } else {
            currentStepIndex++;
            continue parsingLoop;
          }
        }
        break parsingSwitch;
      case 'TO_COORDS':
        if (!data.toProcess.length) {
          return null;
        } else if (match(FIELDS)) {
          result.to = data.lastMatch;
        } else {
          return null;
        }
        break parsingSwitch;
      case 'FROM_RANK':
        if (!data.toProcess.length) {
          // End processing; there's no piece specified hence it's a pawn
          result.piece = 'p';
          currentStepIndex = parseStepsLength - 1;
          break parsingLoop;
        } else if (match(RANKS)) {
          result.fromRank = data.lastMatch;
        }
        break parsingSwitch;
      case 'FROM_FILE':
        if (!data.toProcess.length) {
          // End processing; there's no piece specified hence it's a pawn
          result.piece = 'p';
          currentStepIndex = parseStepsLength - 1;
          break parsingLoop;
        } else if (match(FILES)) {
          result.fromFile = data.lastMatch;
        }
        break parsingSwitch;
      case 'PIECE':
        if (!data.toProcess.length) {
          if (result.fromFile && result.fromRank && !result.promotionPiece) {
            // uci move
            result.piece = '.';
          } else {
            result.piece = 'p';
          }
        } else if (match(PIECES)) {
          if (result.promotionPiece) {
            // Only pawns can be promoted
            return null;
          }
          result.piece = data.lastMatch;
        } else {
          // Unknown piece
          return null;
        }
        break parsingSwitch;
    }

    currentStepIndex++;
  }

  if (data.toProcess.length) {
    // Not a valid expression
    return null;
  } else if (
    (result.piece === 'p' || result.piece === '.') &&
    result.fromFile === 'b' &&
    !result.promotionPiece
  ) {
    result.hasBishopConflict = true;
  }

  const move: IMoveTemplate = {
    piece: result.piece.toLowerCase(),
    to: result.to,
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
