require('jsdom-global')();
const assert = require('assert');
const domify = require('domify');

const {
  getBoard,
  GlobalChessboard,
  VueChessboard,
} = require('../src/chessboard');

describe('GlobalChessboard', function () {
  describe('isPlayersMove', function() {
    beforeEach(function() {
      this.parent = document.createElement('div');

      this.chessboardEl = document.createElement('div');
      this.internalChessObject = {
        _enabled: true,
        rootElement: this.chessboardEl,
        gameSetup: {
          flags: {},
        },
      };
      this.chessboardEl.chessBoard = this.internalChessObject;
      this.parent.appendChild(this.chessboardEl);

      this.cb = new GlobalChessboard(this.chessboardEl);
      this.chessboardEl.chessBoard = this.cb;

      document.body.appendChild(this.parent);
    });

    afterEach(function() {
      this.parent.parentNode.removeChild(this.parent);
    });

    it('takes into account "cursor-spin" class', function() {
      assert.equal(this.cb.isPlayersMove(), true);
      this.parent.classList.add('cursor-spin');
      assert.equal(this.cb.isPlayersMove(), false);
    });

    it('takes into account chessboard._enabled flag', function() {
      assert.equal(this.cb.isPlayersMove(), true);
      this.internalChessObject._enabled = true;
      assert.equal(this.cb.isPlayersMove(), true);
      this.internalChessObject._enabled = false;
      assert.equal(this.cb.isPlayersMove(), false);
    });

    describe('player to move flags', function() {
      /**
       * chessboard.gameSetup.flags.sm - flag showing who is to move
       * (1 means white, 2 means black)
       * chessboard._player - flag showing who are we
       *
       * the flags might be missing (seen only on live board)
       */

      it('allows to make a move if one of flags is undefined', function() {
        // in this case we don't know what to do
        // we just wash our hands off of it
        assert.equal(this.cb.isPlayersMove(), true);


        this.internalChessObject._player = 1;
        assert.equal(this.cb.isPlayersMove(), true);

        delete this.internalChessObject._player;
        this.internalChessObject.gameSetup.flags.sm = 1;
        assert.equal(this.cb.isPlayersMove(), true);
      });

      it('allows to make a move if flags are the same', function() {
        this.internalChessObject._player = 1;
        this.internalChessObject.gameSetup.flags.sm = 1;
        assert.equal(this.cb.isPlayersMove(), true);

        this.internalChessObject._player = 2;
        this.internalChessObject.gameSetup.flags.sm = 2;
        assert.equal(this.cb.isPlayersMove(), true);
      });

      it('doesnt allow to make a move if flags differ', function() {
        this.internalChessObject._player = 1;
        this.internalChessObject.gameSetup.flags.sm = 2;
        assert.equal(this.cb.isPlayersMove(), false);

        this.internalChessObject._player = 2;
        this.internalChessObject.gameSetup.flags.sm = 1;
        assert.equal(this.cb.isPlayersMove(), false);
      });
    });
  });
});
