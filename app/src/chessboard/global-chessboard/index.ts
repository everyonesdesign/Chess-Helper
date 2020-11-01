import get from 'lodash/get';
import {
  RED_SQUARE_COLOR,
  ALL_AREAS,
} from '../../utils';
import {
  Nullable,
  IChessboard,
  TArea,
  IMoveDetails,
} from '../../types';
import {
  IOnMoveEvent,
  IOnRefreshEvent,
  IChessBoard,
  TElementWithChessboard,
} from './types';

/**
 * Global chessboard
 */
export class GlobalChessboard implements IChessboard {
  element: TElementWithChessboard
  board : IChessBoard

  constructor(element: Element) {
    this.element = <TElementWithChessboard>element;
    this.board = this.element.chessBoard;

    this.element.classList.add('ccHelper-board--inited');

    const emitDraw = () => {
      const event = new Event('ccHelper-draw');
      document.dispatchEvent(event);
    };
    this.board.attachEvent('onDropPiece', emitDraw);
    this.board.attachEvent('onAfterMoveAnimated', emitDraw);
    this.board.attachEvent('onRefresh', emitDraw);
  }

  getElement() {
    return this.element;
  }

  getRelativeContainer() {
    return Array.from(this.element.children).filter((c) => c.matches('[id*=boardarea]'))[0];
  }

  makeMove(fromSq: TArea, toSq: TArea, promotionPiece?: string) {
    this.board._clickedPieceElement = fromSq;
    this.board.fireEvent('onDropPiece', {
      fromAreaId: fromSq,
      targetAreaId: toSq,
    });

    if (promotionPiece) {
      this.implementPromotion(promotionPiece);
    }
  }

  isLegalMove(fromSq: TArea, toSq: TArea) {
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

  markArrow(fromSq: TArea, toSq: TArea) {
    this.board.markArrow(fromSq, toSq);
  }

  unmarkArrow(fromSq: TArea, toSq: TArea) {
    this.board.unmarkArrow(fromSq, toSq, true);
  }

  clearMarkedArrows() {
    this.board.clearMarkedArrows();
  }

  markArea(square: TArea) {
    // third parameter is called 'rightClicked'
    // it cleans the areas on moves made with mouse
    this.board.markArea(square, RED_SQUARE_COLOR, true);
  }

  unmarkArea(square: TArea) {
    this.board.unmarkArea(square, true);
  }

  clearMarkedAreas() {
    ALL_AREAS.forEach((area: TArea) => {
      this.unmarkArea(area);
    });
  }

  clearAllMarkings() {
    this.clearMarkedAreas();
    this.clearMarkedArrows();
  }

  onMove(fn: (move: IMoveDetails) => void) : void {
    let announcementLocked = false;

    function eventHandler(event: IOnMoveEvent | IOnRefreshEvent) {
      let from;
      let to;

      if (announcementLocked) return;
      if (!event.moveText) return;

      if (event.customEventName === 'onMove') {
        from = event.fromId;
        to = event.areaId;
      } else if (event.customEventName === 'onRefresh') {
        from = event.fromAreaId;
        to = event.toAreaId;
      }

      let piece = 'p';
      const pieceMatch = event.moveText.match(/^[KQRBN]/);
      if (pieceMatch) {
        piece = pieceMatch[0].toLowerCase();
      }

      let promotionPiece = undefined;
      const promotionMatch = event.moveText.match(/=([QRBN])/);
      if (promotionMatch) {
        promotionPiece = promotionMatch[1].toLowerCase();
      }

      let moveType = 'move';
      if (promotionPiece) {
        moveType = 'promotion';
      } else if (event.moveText.startsWith('O-O-O')) {
        moveType = 'long-castling';
      } else if (event.moveText.startsWith('O-O')) {
        moveType = 'short-castling';
      } else if (event.moveText.includes('x')) {
        moveType = 'capture';
      }

      fn({
        piece,
        moveType,
        from: <string> from,
        to: <string> to,
        promotionPiece,
        check: /\+$/.test(event.moveText),
        checkmate: /\#$/.test(event.moveText),
      });
    }

    // user's moves
    this.board.attachEvent('onMove', eventHandler);

    // computer's moves
    this.board.attachEvent('onRefresh', eventHandler);

    // prevent triggering of refreshes made via game history navigation
    this.board.attachEvent('onMoveForwardBackward', () => {
      announcementLocked = true;
      setTimeout(() => announcementLocked = false, 500);
    });
  }

  implementPromotion(pieceType: string) {
    const style = document.createElement('style');
    style.id='chessHelper__hidePromotionArea';
    style.innerHTML = '.promotion-area, .promotion-menu {opacity: .0000001}';
    document.body.appendChild(style);

    /**
     * Click element asynchronously
     * because otherwise the promotion area won't be in time to be shown
     */
    setTimeout(function() {
      const promotionArea = <Nullable<HTMLElement>>document.querySelector('.promotion-area, .promotion-menu');
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

      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 50);
  }

  submitDailyMove() {
    // noop
  }
}
