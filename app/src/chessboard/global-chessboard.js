const get = require('lodash/get');
const {
  RED_SQUARE_COLOR,
} = require('../utils');

/**
 * Global chessboard
 */
class GlobalChessboard {
  /**
   * Constructor
   * @param  {Element} element
   * @constructor
   */
  constructor(element) {
    this.element = element;
    this.board = element.chessBoard;

    this.element.classList.add('ccHelper-board--inited');

    const emitDraw = () => {
      const event = new Event('ccHelper-draw');
      document.dispatchEvent(event);
    };
    this.board.attachEvent('onDropPiece', emitDraw);
    this.board.attachEvent('onAfterMoveAnimated', emitDraw);
    this.board.attachEvent('onRefresh', emitDraw);
  }

  /**
   * Return DOM element bound to the board
   * @return {Element}
   */
  getElement() {
    return this.element;
  }

  /**
   * Return DOM element for relative positioning
   * e.g. for blindfold mode
   * @return {Element?}
   */
  getRelativeContainer() {
    return [...this.element.children].filter((c) => c.matches('[id*=boardarea]'))[0];
  }

  /**
   * Make move
   * @param  {String} fromSq - e2
   * @param  {String} toSq - e4
   * @param  {String} promotionPiece - q
   */
  makeMove(fromSq, toSq, promotionPiece = null) {
    this.board._clickedPieceElement = fromSq;
    this.board.fireEvent('onDropPiece', {
      fromAreaId: fromSq,
      targetAreaId: toSq,
    });

    if (promotionPiece) {
      this.implementPromotion(promotionPiece);
    }
  }

  /**
   * Is move legal
   * @param  {String}  fromSq e2
   * @param  {String}  toSq   e4
   * @return {Boolean}        [description]
   */
  isLegalMove(fromSq, toSq) {
    return this.board.gameRules.isLegalMove(this.board.gameSetup, fromSq, toSq);
  }

  /**
   * Is it players move now?
   * @return {Boolean} [description]
   */
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

  /**
   * Return object with all the pieces
   * @return {Object} [description]
   */
  getPiecesSetup() {
    return get(this.board, 'gameSetup.pieces', []);
  }

  /**
   * Draw arrow from one point to another
   * @param  {String} fromSq e2
   * @param  {String} toSq   e4
   */
  markArrow(fromSq, toSq) {
    this.board.markArrow(fromSq, toSq);
  }

  /**
   * Remove arrow
   * @param  {String} fromSq e2
   * @param  {String} toSq   e4
   */
  unmarkArrow(fromSq, toSq) {
    this.board.unmarkArrow(fromSq, toSq, true);
  }

  /**
   * Remove all arrows
   */
  clearMarkedArrows() {
    this.board.clearMarkedArrows();
  }

  /**
   * Mark an area
   * @param  {String} square e2
   */
  markArea(square) {
    // third parameter is called 'rightClicked'
    // it cleans the areas on moves made with mouse
    this.board.markArea(square, RED_SQUARE_COLOR, true);
  }

  /**
   * Remove marked area
   * @param  {String} square e2
   */
  unmarkArea(square) {
    this.board.unmarkArea(square, true);
  }

  /**
   * Make a promotion
   * @param  {String} pieceType - what we want the piece to be? q|r|n|b
   */
  implementPromotion(pieceType) {
    const style = document.createElement('style');
    style.id='chessHelper__hidePromotionArea';
    style.innerHTML = '.promotion-area, .promotion-menu {opacity: .0000001}';
    document.body.appendChild(style);

    /**
     * Click element asynchronously
     * because otherwise the promotion area won't be in time to be shown
     */
    setTimeout(function() {
      const promotionArea = document.querySelector('.promotion-area, .promotion-menu');
      if (promotionArea && promotionArea.style.display !== 'none') {
        const selector = `[piece="${pieceType}"], [data-type="${pieceType}"]`;
        const target = promotionArea.querySelector(selector);

        if (target) {
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          target.dispatchEvent(clickEvent);
        }
      }

      style.parentNode.removeChild(style);
    }, 50);
  }
}

module.exports = GlobalChessboard;
