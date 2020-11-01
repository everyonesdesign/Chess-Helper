import svg, { Library, Marker } from 'svg.js';
import get from 'lodash/get';
import {
  squareToCoords,
  coordsToSquare,
  RED_SQUARE_COLOR,
  ALL_AREAS,
} from '../../utils';
import {
  AnyFunction,
  IChessboard,
  TArea,
  IMoveDetails,
} from '../../types';
import {
  TElementWithVueChessboard,
  IVueChessboardStore,
  IPiece,
} from './types';

/**
 * Chessboard implemented with Vue.JS
 * Beta in August 2018
 */
export class VueChessboard implements IChessboard {
  element: TElementWithVueChessboard
  store: IVueChessboardStore
  viewSize: number
  arrowEnd: any
  drawArrows: Library["Doc"]
  drawAreas: Library["Doc"]

  constructor(element: Element) {
    this.element = <TElementWithVueChessboard>element;
    this.store = this.element.__vue__;

    this.element.classList.add('ccHelper-board--inited');

    this.viewSize = this.element.clientWidth;

    this.drawArrows = svg(this.element.id);
    this.drawArrows.node.classList.add('ccHelper-customArrows');
    this.drawArrows.viewbox(0, 0, this.viewSize, this.viewSize);
    this.arrowEnd = this.drawArrows.marker(4, 4, function(this: Marker, add) {
      add.polygon('0,0 0,4 4,2').fill('orange').opacity(1);
      this.ref(0, 2);
    }).size(3, 3);

    this.drawAreas = svg(this.element.id);
    this.drawAreas.node.classList.add('ccHelper-customAreas');
    this.drawAreas.viewbox(0, 0, this.viewSize, this.viewSize);

    setInterval(() => {
      const event = new Event('ccHelper-draw');
      document.dispatchEvent(event);
    }, 200);
  }

  getElement() {
    return this.element;
  }

  getRelativeContainer() {
    return this.element;
  }

  makeMove(fromSq: TArea, toSq: TArea, promotionPiece?: string) {
    const [fromFile, fromRank] = squareToCoords(fromSq);
    const [toFile, toRank] = squareToCoords(toSq);
    this.store.chessboard.emit('MOVE_MADE', {
      from: {
        file: fromFile,
        rank: fromRank,
      },
      to: {
        file: toFile,
        rank: toRank,
        altKey: false,
        isRightClick: false
      },
      isIllegal: false,
      promotion: promotionPiece ? promotionPiece : undefined
    });
  }

  isLegalMove(fromSq: TArea, toSq: TArea) {
    const {legalMoves} = this.store.chessboard.state;
    return legalMoves.some((m) => m.from === fromSq && m.to === toSq);
  }

  isPlayersMove() {
    const {playingAs, sideToMove, gameSettings} = this.store.chessboard.state;

    if (gameSettings.analysis === true) {
      return true;
    }

    if (playingAs !== undefined && sideToMove !== undefined) {
      return playingAs === sideToMove;
    }

    return true;
  }

  getPiecesSetup() {
    const piecesElements = Array.from(this.element.querySelectorAll('.piece'));
    const pieces: Record<string, { color: number, type: string, area: TArea }> = {};

    piecesElements.forEach((el, index) => {
      const background = el.getAttribute('style');

      if (background) {
        const color = /b.\.png"/.test(background) ? 2 : 1;
        const typeMatch = background.match(/(.)\.png"/);

        if (typeMatch) {
          const type = typeMatch[1];
          const areaMatch = el.className.match(/square-(\d+)/);

          if (areaMatch) {
            const area = coordsToSquare(areaMatch[1]);
            pieces[index] = {color, type, area};
          }
        }
      }
    });

    return pieces;
  }

  markArrow(fromSq: TArea, toSq: TArea) {
    const lineId = `ccHelper-arrow-${fromSq}${toSq}`;

    if (svg.get(lineId)) {
      return;
    }

    const fromPosition = this._getSquarePosition(fromSq, false);
    const toPosition = this._getSquarePosition(toSq, false);

    const sizeRatio = this.element.clientWidth / this.viewSize;
    const elementWidth = this.element.clientWidth / sizeRatio;

    const compensationSize = elementWidth / 32; // half of a square
    const compensation = {
      x: {start: 0, end: 0},
      y: {start: 0, end: 0},
    };

    if (fromPosition.x < toPosition.x) {
      compensation.x.start = compensationSize;
      compensation.x.end = -compensationSize;
    } else if (fromPosition.x > toPosition.x) {
      compensation.x.start = -compensationSize;
      compensation.x.end = compensationSize;
    }

    if (fromPosition.y < toPosition.y) {
      compensation.y.start = compensationSize;
      compensation.y.end = -compensationSize;
    } else if (fromPosition.y > toPosition.y) {
      compensation.y.start = -compensationSize;
      compensation.y.end = compensationSize;
    }

    const line = this.drawArrows
      .line(
        fromPosition.x / sizeRatio + compensation.x.start,
        fromPosition.y / sizeRatio + compensation.y.start,
        toPosition.x / sizeRatio + compensation.x.end,
        toPosition.y / sizeRatio + compensation.y.end,
      )
      .stroke({
        width: elementWidth / 55,
        color: 'orange',
        opacity: 1,
      });

    this.drawArrows.add(line);
    line.id(lineId);

    line.marker('end', this.arrowEnd);
  }

  unmarkArrow(fromSq: TArea, toSq: TArea) {
    const lineId = `ccHelper-arrow-${fromSq}${toSq}`;
    const line = svg.get(lineId);
    if (line) {
      line.remove();
    }
  }

  clearMarkedArrows() {
    this.drawArrows.each((i, item) => {
      const id = get(item, '0.node.id');
      if (id && id.startsWith('ccHelper-arrow-')) {
        svg.get(id).remove();
      }
    });
  }

  markArea(square: TArea) {
    const rectId = `ccHelper-rect-${square}`;

    const position = this._getSquarePosition(square, false);
    const sizeRatio = this.element.clientWidth / this.viewSize;
    const elementWidth = this.element.clientWidth / sizeRatio;
    const squareWidth = elementWidth / 8;

    const rect = this.drawAreas
      .rect(squareWidth, squareWidth)
      .attr({
        x: position.x - squareWidth / 2,
        y: position.y - squareWidth / 2,
        fill: RED_SQUARE_COLOR,
      });

    this.drawAreas.add(rect);
    rect.id(rectId);
  }

  unmarkArea(square: TArea) {
    const rectId = `ccHelper-rect-${square}`;
    const rect = svg.get(rectId);
    if (rect) {
      rect.remove();
    }
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

  _getSquarePosition(square: TArea, fromDoc: boolean = true) {
    const isFlipped = this.element.classList.contains('flipped');
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

  onMove(fn: (move: IMoveDetails) => void) : void {
    this.store._events['chessboard-makeMove'].push((event) => {
      setTimeout(() => {
        if (event.isIllegal) return;
        if (typeof event.from !== 'string') return;
        if (typeof event.to !== 'string') return;

        const [toFile, toRank] = squareToCoords(event.to);
        const findPieceByCoords = (p: IPiece) => p.file === toFile && p.rank === toRank;
        const cb = this.store.chessboard;
        const piece = cb.state.pieces.find(findPieceByCoords);

        if (piece) {
          let moveType = 'move';
          if (cb.state.previousPieces.find(findPieceByCoords)) {
            moveType = 'capture';
          } else if (
            (piece.type === 'k' && event.from === 'e1' && event.to === 'g1') ||
            (piece.type === 'k' && event.from === 'e8' && event.to === 'g8')
          ) {
            moveType = 'short-castling';
          } else if (
            (piece.type === 'k' && event.from === 'e1' && event.to === 'c1') ||
            (piece.type === 'k' && event.from === 'e8' && event.to === 'c8')
          ) {
            moveType = 'long-castling';
          }

          fn({
            piece: piece.type,
            from: event.from,
            to: event.to,
            promotionPiece: event.promotion ? event.promotion : undefined,
            moveType,
            check: this.store.game.setup.check,
            checkmate: this.store.game.setup.checkmate,
          });
        }
      });
    });
  }

  submitDailyMove() {
    // noop
  }
}
