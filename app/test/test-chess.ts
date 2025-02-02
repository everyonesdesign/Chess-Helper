import jsDomGlobal from 'jsdom-global';
import assert from 'assert';

jsDomGlobal();

import {
  getLegalMoves,
  parseMoveInput,
} from '../src/chess';
import {
  IChessboard,
  TArea,
} from '../src/types';

describe('parseMoveInput', function() {
  it('parses short piece moves (Rd2)', function() {
    assert.deepEqual(parseMoveInput('Rd2'), [{
      piece: 'r',
      from: '..',
      to: 'd2',
    }]);
  });

  it('parses short pawn moves (d2)', function() {
    assert.deepEqual(parseMoveInput('d2'), [{
      piece: 'p',
      from: '..',
      to: 'd2',
    }]);
  });

  it('parses piece full moves (Re2d2)', function() {
    assert.deepEqual(parseMoveInput('Re2d2'), [{
      piece: 'r',
      from: 'e2',
      to: 'd2',
    }]);
  });

  it('parses pawn captures (exd3, exd3e.p.)', function() {
    assert.deepEqual(parseMoveInput('exd3'), [{
      piece: 'p',
      from: 'e.',
      to: 'd3',
    }]);

    // en passant
    assert.deepEqual(parseMoveInput('exd3e.p.'), [{
      piece: 'p',
      from: 'e.',
      to: 'd3',
    }]);
  });

  it('parses piece captures (Rxd2)', function() {
    assert.deepEqual(parseMoveInput('Rxd2'), [{
      piece: 'r',
      from: '..',
      to: 'd2',
    }]);
  });

  it('parses full piece captures (Re2xd2)', function() {
    assert.deepEqual(parseMoveInput('Re2xd2'), [{
      piece: 'r',
      from: 'e2',
      to: 'd2',
    }]);
  });

  it('parses partial disambiguation (R2xd2, Rexd2)', function() {
    assert.deepEqual(parseMoveInput('R2xd2'), [{
      piece: 'r',
      from: '.2',
      to: 'd2',
    }]);

    assert.deepEqual(parseMoveInput('Rexd2'), [{
      piece: 'r',
      from: 'e.',
      to: 'd2',
    }]);
  });

  it('allows to mark a check (Rd2+)', function() {
    assert.deepEqual(parseMoveInput('Rd2+'), [{
      piece: 'r',
      from: '..',
      to: 'd2',
    }]);
  });

  it('allows to mark a mate (Rd2#)', function() {
    assert.deepEqual(parseMoveInput('Rd2#'), [{
      piece: 'r',
      from: '..',
      to: 'd2',
    }]);
  });

  it('parses castling (o-o, 0-0, ooo, 0-0-0)', function() {
    assert.deepEqual(parseMoveInput('o-o'), [
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

    assert.deepEqual(parseMoveInput('0-0'), [
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

    assert.deepEqual(parseMoveInput('ooo'), [
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

    assert.deepEqual(parseMoveInput('0-0-0'), [
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

  it('ignores not-existing pieces and squares (Xd2)', function() {
    assert.deepEqual(parseMoveInput('Xd2'), []);
  });

  it('parses pawn promotion (d8=Q)', function() {
    assert.deepEqual(parseMoveInput('d8=Q'), [{
      piece: 'p',
      from: '..',
      to: 'd8',
      promotionPiece: 'q',
    }]);
  });

  it('ignores promotion for pieces (Nd8=Q)', function() {
    assert.deepEqual(parseMoveInput('Nd8=Q'), []);
  });

  describe('allows lowercase piece letter if unambiguous (b3, Bb3, bc4, bxb3)', function() {
    it('b3', function () {
      assert.deepEqual(parseMoveInput('b3'), [{
        piece: 'p',
        from: '..',
        to: 'b3',
      }]);
    });
    it('Bb3', function () {
      assert.deepEqual(parseMoveInput('Bb3'), [{
        piece: 'b',
        from: '..',
        to: 'b3',
      }]);
    });
    it('bc4', function () {
      assert.deepEqual(parseMoveInput('bc4'), [
        {
          piece: 'b',
          from: '..',
          to: 'c4',
        },
        {
          piece: 'p',
          from: 'b.',
          to: 'c4',
        },
      ]);
    });
    it('bxb3', function () {
      // "From file" coordinate is redundant in case of a pawn move
      // Thus moves like that are interpreted as bishop moves
      assert.deepEqual(parseMoveInput('bxb3'), [
        {
          piece: 'b',
          from: '..',
          to: 'b3',
        },
      ]);
    });
    it('b2c3', function () {
      // This looks like a UCI move. Let's parse it as UCI
      assert.deepEqual(parseMoveInput('b2c3'), [
        {
          from: 'b2',
          piece: '.',
          to: 'c3',
        },
        {
          from: '.2',
          piece: 'b',
          to: 'c3',
        },
      ]);
    });
  });

  it('parses simple UCL (e2e4)', function() {
    assert.deepEqual(parseMoveInput('e2e4'), [{
      piece: '.',
      from: 'e2',
      to: 'e4',
    }]);
  });

  it('parses promotion UCL (e7e8n)', function() {
    assert.deepEqual(parseMoveInput('e7e8n'), [{
      piece: '.',
      from: 'e7',
      promotionPiece: 'n',
      to: 'e8',
    }]);
  });

  it('ignores non-existing UCL squares (x2e4)', function() {
    assert.deepEqual(parseMoveInput('x2e4'), []);
  });

  it('ignores other formats (♞f3)', function() {
    assert.deepEqual(parseMoveInput('♞f3'), []);
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

  it('resolves ambiguity if the results are the same', function() {
    const board = getChessBoardWithPieces([
      {color: 2, type: 'b', area: 'b5'},
    ]);
    const result = getLegalMoves(board, parseMoveInput('b5d7'));
    assert.deepEqual(result, [{
      from: 'b5',
      piece: 'b',
      to: 'd7',
    }]);
  });
});
