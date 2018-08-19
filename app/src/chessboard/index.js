const forEach = require('lodash/forEach');
const GlobalChessboard = require('./global-chessboard.js');
const VueChessboard = require('./vue-chessboard.js');
const {
  boards,
} = require('../globals');

/**
 * Get active board instance
 * @return {ChessBoard?}
 */
function getBoard() {
  const element = document.querySelector('.chessboard, .board');

  const existingBoard = boards.get(element);
  if (existingBoard) {
    return existingBoard;
  }

  const boardSelectorMappings = {
    '.chessboard': GlobalChessboard,
    '.board': VueChessboard,
  };

  let board = null;

  forEach(boardSelectorMappings, (Constructor, selector) => {
    if (element.matches(selector)) {
      board = new Constructor(element);
      // exit loop
      return false;
    }
  });

  if (board) {
    boards.set(element, board);
  }

  return board;
}

module.exports = {
  GlobalChessboard,
  VueChessboard,
  getBoard,
};
