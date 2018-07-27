require('jsdom-global')();
const assert = require('assert');

const {
  getBoard,
} = require('../src/chess');

describe('getBoard', function() {
  it('should return board for computer chess', function() {
    window.myEvent = {
      capturingBoard: 'chessboard!',
    };

    const board = getBoard();

    assert.equal(board, 'chessboard!');

    delete window.myEvent;
  });

  it('should return board for old live chess', function() {
    window.boardsService = {
      getSelectedBoard() {
        return {
          chessboard: 'chessboard!',
        };
      },
    };

    const board = getBoard();

    assert.equal(board, 'chessboard!');

    delete window.boardsService;
  });

  it('should return board for new live chess', function() {
    window.liveClient = {
      controller: {
        activeBoard: {
          chessboard: 'chessboard!',
        },
      },
    };

    const board = getBoard();

    assert.equal(board, 'chessboard!');

    delete window.liveClient;
  });

  it('should return null if theres no board', function() {
    const board = getBoard();

    assert.strictEqual(board, null);
  });
});

