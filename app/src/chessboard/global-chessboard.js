const get = require('lodash/get');
const {
  drawMovesOnBoard,
} = require('../chess');
const {
  RED_SQUARE_COLOR,
} = require('../utils');
const {
  boards,
} = require('../globals');

/**
 * Global chessboard
 */
class GlobalChessboard {
  constructor(element) {
    const existingBoard = boards.get(element);
    if (existingBoard) {
      return existingBoard;
    }

    this.element = element;
    this.board = element.chessBoard;
  }

  getElement() {
    return this.element;
  }

  makeMove(fromAreaId, targetAreaId) {
    this.board.fireEvent('onDropPiece', {fromAreaId, targetAreaId});
  }

  isLegalMove(fromSq, toSq) {
    return this.board.gameRules.isLegalMove(this.board.gameSetup, fromSq, toSq);
  }

  isPlayersMove() {
    if (this.element && this.element.closest('.cursor-spin')) {
      return false;
    }

    if (this.board._enabled === false) {
      return false;
    }

    const sideToMove = get(this.board, 'gameSetup.flags.sm');
    const playerSide = this.board._player;
    if (sideToMove && playerSide && sideToMove !== playerSide) {
      return false;
    }

    return true;
  }

  getPiecesSetup() {
    return get(this.board, 'gameSetup.pieces', []);
  }

  markArrow(fromSq, toSq) {
    this.board.markArrow(fromSq, toSq);
  }

  unmarkArrow(fromSq, toSq) {
    this.board.unmarkArrow(fromSq, toSq, true);
  }

  clearMarkedArrows() {
    this.board.clearMarkedArrows();
  }

  markArea(coord) {
    // third parameter is called 'rightClicked'
    // it cleans the areas on moves made with mouse
    this.board.markArea(coord, RED_SQUARE_COLOR, true);
  }

  unmarkArea(coord) {
    this.board.unmarkArea(coord, true)
  }
}

module.exports = GlobalChessboard;
