import jsDomGlobal from 'jsdom-global';
import assert from 'assert';

jsDomGlobal();

import {
  getLegalMoves,
} from '../src/chess';
import {
  IChessboard,
  TArea,
} from '../src/types';

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
