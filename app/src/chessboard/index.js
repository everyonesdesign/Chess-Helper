const GlobalChessboard = require('./global-chessboard.js');
const VueChessboard = require('./vue-chessboard.js');

/**
 * Get active board instance
 * @return {ChessBoard?}
 */
function getBoard() {
  const globalChessboardEl = document.querySelector('.chessboard');
  if (globalChessboardEl) {
    return new GlobalChessboard(globalChessboardEl);
  }

  const vueChessboardEl = document.querySelector('.board');
  if (vueChessboardEl) {
    return new VueChessboard(vueChessboardEl);
  }

  return null;
}

module.exports = {
  GlobalChessboard,
  VueChessboard,
  getBoard,
};
