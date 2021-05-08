import find from 'lodash/find';
import {
  IChessboard,
  TArea,
  IMoveDetails,
} from '../../types';
import {
  IGame,
  TElementWithGame,
  IMoveEvent,
} from './types';
import {
  squareToCoords,
  ALL_AREAS,
} from '../../utils';
import {
  dispatchPointerEvent,
} from '../../dom-events';

/**
 * Chessboard implemented with some kinds of web components
 * Beta in April 2020
 */
export class ComponentChessboard implements IChessboard {
  element: TElementWithGame
  game: IGame

  constructor(element: Element) {
    this.element = <TElementWithGame>element;
    this.game = this.element.game;

    this.game.on('Move', () => {
      const event = new Event('ccHelper-draw');
      document.dispatchEvent(event);
    });
  }

  getElement() {
    return this.element;
  }

  getRelativeContainer() {
    return this.element;
  }

  makeMove(fromSq: TArea, toSq: TArea, promotionPiece?: string) {
    const move = { from: fromSq, to: toSq };

    // In case of promotion only interact via JS API
    if (!promotionPiece) {
      const fromPosition = this._getSquarePosition(fromSq);
      const toPosition = this._getSquarePosition(toSq);
      dispatchPointerEvent(this.element, 'pointerdown', { x: fromPosition.x, y: fromPosition.y });
      dispatchPointerEvent(this.element, 'pointerup', { x: toPosition.x, y: toPosition.y });
    }

    this.game.move({
      ...move,
      promotion: promotionPiece,
      animate: false
    });
  }

  isLegalMove(fromSq: TArea, toSq: TArea) {
    const legalMoves = this.game.getLegalMoves();
    return Boolean(find(legalMoves, { from: fromSq, to: toSq }));
  }

  isPlayersMove() {
    if (this.game.getOptions().analysis) {
      return true;
    }

    if (!this.game.getPlayingAs) {
      return false;
    }

    return this.game.getTurn() === this.game.getPlayingAs();
  }

  getPiecesSetup() {
    const pieces = this.game.getPieces().getCollection();
    return Object.values(pieces).reduce((acc, piece) => ({
      ...acc,
      [piece.square]: {
        color: piece.color, type: piece.type, area: piece.square
      }
    }), {});
  }

  markArrow(fromSq: TArea, toSq: TArea) {
    const arrowCoords = `${fromSq}${toSq}`;
    const markings = this.game.getMarkings();
    if (!markings.arrow[arrowCoords]) {
      this.game.toggleMarking({ arrow: { color: 'd', from: fromSq, to: toSq }});
    }

    // legacy call, probably can be removed in the future
    setTimeout(() => {
      const markings = this.game.getMarkings();
      if (!markings.arrow[arrowCoords]) {
        try {
          this.game.toggleMarking({ key: arrowCoords, type: 'arrow' });
        } catch(e) {}
      }
    });
  }

  unmarkArrow(fromSq: TArea, toSq: TArea) {
    const arrowCoords = `${fromSq}${toSq}`;
    const markings = this.game.getMarkings();
    if (markings.arrow[arrowCoords]) {
      this.game.toggleMarking({ arrow: { color: 'd', from: fromSq, to: toSq }});
    }

    // legacy call, probably can be removed in the future
    setTimeout(() => {
      const markings = this.game.getMarkings();
      if (markings.arrow[arrowCoords]) {
        try {
          this.game.toggleMarking({ key: arrowCoords, type: 'arrow' });
        } catch(e) {}
      }
    });
  }

  clearMarkedArrows() {
    const markings = this.game.getMarkings();
    const arrowMarkings = markings.arrow;
    Object.values(arrowMarkings).forEach((arrow) => {
      const { from, to } = arrow;
      this.unmarkArrow(from, to);
    });
  }

  markArea(square: TArea) {
    const markings = this.game.getMarkings();
    if (!markings.square[square]) {
      this.game.toggleMarking({ square: { color: 'd', square }});
    }

    // legacy call, probably can be removed in the future
    setTimeout(() => {
      const markings = this.game.getMarkings();
      if (!markings.square[square]) {
        try {
          this.game.toggleMarking({ key: square, type: 'square' });
        } catch(e) {}
      }
    });
  }

  unmarkArea(square: TArea) {
    const markings = this.game.getMarkings();
    if (markings.square[square]) {
      this.game.toggleMarking({ square: { color: 'd', square }});
    }

    // legacy call, probably can be removed in the future
    setTimeout(() => {
      const markings = this.game.getMarkings();
      if (markings.square[square]) {
        try {
          this.game.toggleMarking({ key: square, type: 'square' });
        } catch(e) {}
      }
    });
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

  submitDailyMove() {
    const dailyComponent = document.querySelector('.daily-game-footer-component');
    if (dailyComponent) {
        (<any>dailyComponent).__vue__.$emit('save-move');
    }
  }

  _getMoveData(event: IMoveEvent): IMoveDetails {
    const data = event.data.move;
    let moveType = 'move';
    if (data.san.startsWith('O-O-O')) {
      moveType = 'long-castling';
    } else if (data.san.startsWith('O-O')) {
      moveType = 'short-castling';
    } else if (data.capturedStr) {
      moveType = 'capture';
    }

    return {
      piece: data.piece,
      moveType,
      from: data.from,
      to: data.to,
      promotionPiece: data.promotion,
      check: /\+$/.test(data.san),
      checkmate: /\#$/.test(data.san),
    };
  }

  _getSquarePosition(square: TArea, fromDoc: boolean = true) {
    const isFlipped = this.element.game.getOptions().flipped;
    const coords = squareToCoords(square);
    const {left, top, width} = this.element.getBoundingClientRect();
    const squareWidth = width / 8;
    const correction = squareWidth / 2;

    if (!isFlipped) {
      return {
        x: (fromDoc ? left : 0) + squareWidth * coords[0] - correction,
        y: (fromDoc ? top : 0) + width - squareWidth * coords[1] + correction,
      };
    } else {
      return {
        x: (fromDoc ? left : 0) + width - squareWidth * coords[0] + correction,
        y: (fromDoc ? top : 0) + squareWidth * coords[1] - correction,
      };
    }
  }
}
