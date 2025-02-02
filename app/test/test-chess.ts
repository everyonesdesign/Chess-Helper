import jsDomGlobal from 'jsdom-global';
import assert from 'assert';

jsDomGlobal();

import {
  parseAlgebraic,
  parseUCI,
  getLegalMoves,
  parseMoveInput,
} from '../src/chess';
import {
  IChessboard,
  TArea,
} from '../src/types';

function getExecutionTime(fn: Function, cycles: number = 1000): number {
  const start = Date.now();
  for (let i = 0; i < cycles; i++) {
    fn();
  }
  const end = Date.now();
  return end - start;
}

describe('parseAlgebraic', function() {
  it('parses short algebraic moves', function() {
    assert.deepEqual(parseAlgebraic('Rd2'), [{
      piece: 'r',
      from: '..',
      to: 'd2',
    }]);
  });

  it('parses pawn moves', function() {
    assert.deepEqual(parseAlgebraic('d2'), [{
      piece: 'p',
      from: '..',
      to: 'd2',
    }]);
  });

  it('parses full moves', function() {
    assert.deepEqual(parseAlgebraic('Re2d2'), [{
      piece: 'r',
      from: 'e2',
      to: 'd2',
    }]);
  });

  it('parses pawn captures', function() {
    assert.deepEqual(parseAlgebraic('exd3'), [{
      piece: 'p',
      from: 'e.',
      to: 'd3',
    }]);

    // en passant
    assert.deepEqual(parseAlgebraic('exd3e.p.'), [{
      piece: 'p',
      from: 'e.',
      to: 'd3',
    }]);
  });

  it('parses piece captures', function() {
    assert.deepEqual(parseAlgebraic('Rxd2'), [{
      piece: 'r',
      from: '..',
      to: 'd2',
    }]);
  });

  it('parses full piece captures', function() {
    assert.deepEqual(parseAlgebraic('Re2xd2'), [{
      piece: 'r',
      from: 'e2',
      to: 'd2',
    }]);
  });

  it('parses partial disambiguation', function() {
    assert.deepEqual(parseAlgebraic('R2xd2'), [{
      piece: 'r',
      from: '.2',
      to: 'd2',
    }]);

    assert.deepEqual(parseAlgebraic('Rexd2'), [{
      piece: 'r',
      from: 'e.',
      to: 'd2',
    }]);
  });

  it('allows to mark a check', function() {
    assert.deepEqual(parseAlgebraic('Rd2+'), [{
      piece: 'r',
      from: '..',
      to: 'd2',
    }]);
  });

  it('allows to mark a mate', function() {
    assert.deepEqual(parseAlgebraic('Rd2#'), [{
      piece: 'r',
      from: '..',
      to: 'd2',
    }]);
  });

  it('parses castling', function() {
    assert.deepEqual(parseAlgebraic('o-o'), [
      {
        piece: 'k',
        from: 'e1',
        to: 'g1',
      },
      {
        piece: 'k',
        from: 'e8',
        to: 'g8',
      }
    ]);

    assert.deepEqual(parseAlgebraic('0-0'), [
      {
        piece: 'k',
        from: 'e1',
        to: 'g1',
      },
      {
        piece: 'k',
        from: 'e8',
        to: 'g8',
      }
    ]);

    assert.deepEqual(parseAlgebraic('ooo'), [
      {
        piece: 'k',
        from: 'e1',
        to: 'c1',
      },
      {
        piece: 'k',
        from: 'e8',
        to: 'c8',
      }
    ]);

    assert.deepEqual(parseAlgebraic('0-0-0'), [
      {
        piece: 'k',
        from: 'e1',
        to: 'c1',
      },
      {
        piece: 'k',
        from: 'e8',
        to: 'c8',
      }
    ]);
  });

  it('ignores not-existing pieces and squares', function() {
    assert.deepEqual(parseAlgebraic('Xd2'), []);
  });

  it('parses pawn promotion', function() {
    assert.deepEqual(parseAlgebraic('d8=Q'), [{
      piece: 'p',
      from: '..',
      to: 'd8',
      promotionPiece: 'q',
    }]);
  });

  it('ignores promotion for pieces', function() {
    assert.deepEqual(parseAlgebraic('Nd8=Q'), []);
  });

  describe('allows lowercase piece letter if unambiguous', function() {
    it('b3', function () {
      assert.deepEqual(parseAlgebraic('b3'), [{
        piece: 'p',
        from: '..',
        to: 'b3',
      }]);
    });
    it('Bb3', function () {
      assert.deepEqual(parseAlgebraic('Bb3'), [{
        piece: 'b',
        from: '..',
        to: 'b3',
      }]);
    });
    it('bc4', function () {
      assert.deepEqual(parseAlgebraic('bc4'), [
        {
          piece: 'p',
          from: 'b.',
          to: 'c4',
        },
        {
          piece: 'b',
          from: '..',
          to: 'c4',
        },
      ]);
    });
    it('bxb3', function () {
      // "From file" coordinate is redundant in case of a pawn move
      // Thus moves like that are interpreted as bishop moves
      assert.deepEqual(parseAlgebraic('bxb3'), [
        {
          piece: 'b',
          from: '..',
          to: 'b3',
        },
      ]);
    });
    it('b2c3', function () {
      // This looks like a UCI move. Let's parse it as UCI
      assert.deepEqual(parseAlgebraic('b2c3'), []);
    });
  });

  it('returns null for UCI', function() {
    assert.deepEqual(parseAlgebraic('e2e4'), []);
  });

  it('returns null for UCI with promotion', function() {
    assert.deepEqual(parseAlgebraic('e7e8n'), []);
  });
});

describe('parseUCI', function() {
  it('parses short algebraic moves', function() {
    assert.deepEqual(parseUCI('e2e4'), [{
      piece: '.',
      from: 'e2',
      to: 'e4',
    }]);
  });

  it('parses promotion', function() {
    assert.deepEqual(parseUCI('e7e8n'), [{
      piece: '.',
      from: 'e7',
      promotionPiece: 'n',
      to: 'e8',
    }]);
  });

  it('ignores non-existing squares', function() {
    assert.deepEqual(parseUCI('x2e4'), []);
  });

  it('ignores other formats', function() {
    assert.deepEqual(parseUCI('♞f3'), []);
  });
});

describe('parseMoveInput', function() {
  it('parces algebraic', function() {
    assert.deepEqual(parseMoveInput('Nf3'), [{
      piece: 'n',
      from: '..',
      to: 'f3',
    }]);
  });

  it('parces UCI', function() {
    assert.deepEqual(parseMoveInput('e2e4'), [{
      piece: '.',
      from: 'e2',
      to: 'e4',
    }]);
  });

  describe('Parses queries in time', function() {
    const LIMIT = 5;
    it('Parses d2 in time', function() { assert(getExecutionTime(() => parseMoveInput('d2')) < LIMIT); });
    it('Parses bc4 in time', function() { assert(getExecutionTime(() => parseMoveInput('bc4')) < LIMIT); });
    it('Parses 0-0-0 in time', function() { assert(getExecutionTime(() => parseMoveInput('0-0-0')) < LIMIT); });
    it('Parses 0-0 in time', function() { assert(getExecutionTime(() => parseMoveInput('0-0')) < LIMIT); });
    it('Parses 00 in time', function() { assert(getExecutionTime(() => parseMoveInput('00')) < LIMIT); });
    it('Parses b2c3 in time', function() { assert(getExecutionTime(() => parseMoveInput('b2c3')) < LIMIT); });
    it('Parses b3 in time', function() { assert(getExecutionTime(() => parseMoveInput('b3')) < LIMIT); });
    it('Parses b8=n in time', function() { assert(getExecutionTime(() => parseMoveInput('b8=n')) < LIMIT); });
    it('Parses Bb3 in time', function() { assert(getExecutionTime(() => parseMoveInput('Bb3')) < LIMIT); });
    it('Parses bb7 in time', function() { assert(getExecutionTime(() => parseMoveInput('bb7')) < LIMIT); });
    it('Parses bxb3 in time', function() { assert(getExecutionTime(() => parseMoveInput('bxb3')) < LIMIT); });
    it('Parses d8=Q in time', function() { assert(getExecutionTime(() => parseMoveInput('d8=Q')) < LIMIT); });
    it('Parses e2e4 in time', function() { assert(getExecutionTime(() => parseMoveInput('e2e4')) < LIMIT); });
    it('Parses e7e8n in time', function() { assert(getExecutionTime(() => parseMoveInput('e7e8n')) < LIMIT); });
    it('Parses exd3 in time', function() { assert(getExecutionTime(() => parseMoveInput('exd3')) < LIMIT); });
    it('Parses exd3e.p. in time', function() { assert(getExecutionTime(() => parseMoveInput('exd3e.p.')) < LIMIT); });
    it('Parses Nd8=Q in time', function() { assert(getExecutionTime(() => parseMoveInput('Nd8=Q')) < LIMIT); });
    it('Parses o-o in time', function() { assert(getExecutionTime(() => parseMoveInput('o-o')) < LIMIT); });
    it('Parses ooo in time', function() { assert(getExecutionTime(() => parseMoveInput('ooo')) < LIMIT); });
    it('Parses qb3xc4 in time', function() { assert(getExecutionTime(() => parseMoveInput('qb3xc4')) < LIMIT); });
    it('Parses R2xd2 in time', function() { assert(getExecutionTime(() => parseMoveInput('R2xd2')) < LIMIT); });
    it('Parses Rd2 in time', function() { assert(getExecutionTime(() => parseMoveInput('Rd2')) < LIMIT); });
    it('Parses Rd2# in time', function() { assert(getExecutionTime(() => parseMoveInput('Rd2#')) < LIMIT); });
    it('Parses Rd2+ in time', function() { assert(getExecutionTime(() => parseMoveInput('Rd2+')) < LIMIT); });
    it('Parses Re2d2 in time', function() { assert(getExecutionTime(() => parseMoveInput('Re2d2')) < LIMIT); });
    it('Parses Re2xd2 in time', function() { assert(getExecutionTime(() => parseMoveInput('Re2xd2')) < LIMIT); });
    it('Parses Rexd2 in time', function() { assert(getExecutionTime(() => parseMoveInput('Rexd2')) < LIMIT); });
    it('Parses Rxd2 in time', function() { assert(getExecutionTime(() => parseMoveInput('Rxd2')) < LIMIT); });
    it('Parses Xd2 in time', function() { assert(getExecutionTime(() => parseMoveInput('Xd2')) < LIMIT); });
  });
});

describe('getLegalMoves', function() {
  interface IPiece { color: number, type: string, area: string };

  const getChessBoardWithPieces = (input: IPiece[]) : IChessboard => {
    const pieces: Record<string, IPiece> = {};

    input.forEach((p, i) => {
      pieces[i] = p;
    });

    return {
      isLegalMove: () => true,
      isPlayersMove: () => true,
      getPiecesSetup: () => pieces,
      getElement: () => document.createElement('div'),
      getRelativeContainer: () => document.createElement('div'),
      makeMove: (fromSq: TArea, toSq: TArea, promotionPiece?: string) => {},
      markArrow: (fromSq: TArea, toSq: TArea) => {},
      unmarkArrow: (fromSq: TArea, toSq: TArea) => {},
      clearMarkedArrows: () => {},
      markArea: (square: TArea) => {},
      unmarkArea: (square: TArea) => {},
      clearMarkedAreas: () => {},
      clearAllMarkings: () => {},
      submitDailyMove: () => {},
    };
  };

  it('returns from and to if these are explicitly specified', function() {
    const board = getChessBoardWithPieces([
      {color: 2, type: 'p', area: 'e2'},
    ]);
    const result = getLegalMoves(board, [{
      piece: '.',
      from: 'e2',
      to: 'e4',
    }]);

    assert.deepEqual(result, [{
      from: 'e2',
      piece: '.',
      to: 'e4',
    }]);
  });

  it('handles partial matches', function() {
    const board = getChessBoardWithPieces([
      {color: 2, type: 'p', area: 'e2'},
    ]);
    const result = getLegalMoves(board, [{
      piece: '.',
      from: '.2',
      to: 'e4',
    }]);

    assert.deepEqual(result, [{
      from: 'e2',
      piece: '.',
      to: 'e4',
    }]);
  });

  it('ignores ambiguous results', function() {
    const board = getChessBoardWithPieces([
      {color: 2, type: 'p', area: 'e2'},
      {color: 2, type: 'p', area: 'c2'},
    ]);

    const result = getLegalMoves(board, [{
      piece: '.',
      from: '.2',
      to: 'e4',
    }]);

    assert.deepEqual(result, [{
      from: 'e2',
      piece: '.',
      to: 'e4',
    },
    {
      from: 'c2',
      piece: '.',
      to: 'e4',
    }]);
  });

  it('returns empty if there are no matching pieces', function() {
    const board1 = getChessBoardWithPieces([
      // no pieces on 'from' spot
      {color: 2, type: 'p', area: 'c2'},
    ]);
    const result1 = getLegalMoves(board1, [{
      piece: '.',
      from: 'e2',
      to: 'e4',
    }]);
    assert.deepEqual(result1, []);

    const board2 = getChessBoardWithPieces([
      // piece of a different type
      {color: 2, type: 'p', area: 'e2'},
    ]);
    const result2 = getLegalMoves(board2, [{
      piece: 'r',
      from: 'e2',
      to: 'e4',
    }]);
    assert.deepEqual(result2, []);
  });

  it('doesnt fail if input is falsy', function() {
    const board = getChessBoardWithPieces([
      {color: 2, type: 'p', area: 'c2'},
    ]);
    assert.doesNotThrow(() => getLegalMoves(board, []));
  });

  it('returns promotion piece properly', function() {
    const board = getChessBoardWithPieces([
      {color: 2, type: 'p', area: 'd7'},
    ]);
    const result = getLegalMoves(board, [{
      piece: 'p',
      from: '..',
      to: 'd8',
      promotionPiece: 'q',
    }]);
    assert.deepEqual(result, [{
      from: 'd7',
      piece: 'p',
      promotionPiece: 'q',
      to: 'd8',
    }]);
  });
});
