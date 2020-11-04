import find from 'lodash/find';
import {
  IChessboard,
  TArea,
  IMoveDetails,
} from '../../types';
import {
  IGame,
  TElementWithGame,
  IMove,
  IFullMove,
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
  moveListeners: Array<(move: IMoveDetails) => void>

  constructor(element: Element) {
    this.element = <TElementWithGame>element;
    this.game = this.element.game;
    this.moveListeners = [];

    this._initGameObject();
    this._watchBoardChange();
  }

  getElement() {
    return this.element;
  }

  getRelativeContainer() {
    return this.element;
  }

  makeMove(fromSq: TArea, toSq: TArea, promotionPiece?: string) {
    const move = { from: fromSq, to: toSq };
    const fromPosition = this._getSquarePosition(fromSq);
    const toPosition = this._getSquarePosition(toSq);
    dispatchPointerEvent(this.element, 'pointerdown', { x: fromPosition.x, y: fromPosition.y });
    dispatchPointerEvent(this.element, 'pointerup', { x: toPosition.x, y: toPosition.y });

    this.game.move(<IMove>{
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

  onMove(fn: (move: IMoveDetails) => void) : void {
    this.moveListeners.push(fn);
  }

  submitDailyMove() {
    const dailyComponent = document.querySelector('.daily-game-footer-component');
    if (dailyComponent) {
        (<any>dailyComponent).__vue__.$emit('save-move');
    }
  }

  _getMoveData(move: IMove | IFullMove): IMoveDetails {
    let moveType = 'move';
    const san = move.san || '';
    if (san.startsWith('O-O-O')) {
      moveType = 'long-castling';
    } else if (san.startsWith('O-O')) {
      moveType = 'short-castling';
    } else if (move.capturedStr) {
      moveType = 'capture';
    }

    return {
      piece: move.piece,
      moveType,
      from: move.from,
      to: move.to,
      promotionPiece: move.promotion,
      check: /\+$/.test(san),
      checkmate: /\#$/.test(san),
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

  _watchBoardChange() {
    setInterval(() => {
      const newBoard = document.querySelector('chess-board');
      if (newBoard && newBoard !== this.element) {
        this.element = <TElementWithGame>newBoard;
        this.game = this.element.game;
        this._initGameObject();
      }
    }, 500);
  }

  _initGameObject() : void {
    const self = this;
    const originalMove = this.game.move;
    this.game.move = function(move: IMove) {
      try {
        setTimeout(() => {
          const event = new Event('ccHelper-draw');
          document.dispatchEvent(event);

          const fullMove = self.game.getLastMove();
            // filter out premoves
          if (fullMove && fullMove.from === move.from && fullMove.to === move.to) {
            self.moveListeners.forEach(listener => listener(self._getMoveData(fullMove)));
          }
        });
      } catch(e) {
        console.error(e);
      }

      // @ts-ignore
      return originalMove.apply(this, arguments);
    };
  }
}
