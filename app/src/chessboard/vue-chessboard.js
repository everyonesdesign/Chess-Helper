const SVG = require('svg.js');
const get = require('lodash/get');
const {
  boards,
} = require('../globals');

/**
 * Global chessboard
 */

const MOUSE_WHICH = {
  no: 0,
  left: 1,
  middle: 2,
  right: 3,
};

const MOUSE_BUTTON = {
  left: 0,
  right: 2,
};

function squareToCoords(square) {
  const hor = '0' + ('abcdefgh'.indexOf(square[0]) + 1);
  const ver = '0' + square[1];
  return [hor, ver];
}

function coordsToSquare(coords) {
  const numbers = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return numbers[coords.slice(1, 2)] + coords.slice(3, 4);
}

function dispatchMouseEvent(element, {
  name,
  which = MOUSE_WHICH.left,
  button = MOUSE_BUTTON.left,
  x = 0,
  y = 0,
}) {
  element.dispatchEvent(new MouseEvent(name, {
    bubbles: true,
    cancelable: true,
    view: window,
    which,
    buttons: which,
    clientX: x,
    clientY: y,
  }));
}

class VueChessboard {
  constructor(element) {
    const existingBoard = boards.get(element);
    if (existingBoard) {
      return existingBoard;
    }
    boards.set(element, this);

    this.element = element;
    this.draw = SVG(this.element.id);

    this.viewSize = this.element.clientWidth;
    this.draw.viewbox(0, 0, this.viewSize, this.viewSize);
    this.draw.group().id('board-group');
  }

  getElement() {
    return this.element;
  }

  makeMove(fromSq, toSq) {
    const fromCoords = squareToCoords(fromSq);
    const pieceElement = this.element.querySelector(`.piece.square-${fromCoords.join('')}`);
    if (pieceElement) {
      const fromPosition = this._getSquarePosition(fromSq);
      dispatchMouseEvent(pieceElement, {
        name: 'mousedown',
        x: fromPosition.x,
        y: fromPosition.y,
      });

      const toPosition = this._getSquarePosition(toSq);
      dispatchMouseEvent(pieceElement, {
        name: 'mouseup',
        x: toPosition.x,
        y: toPosition.y,
      });
    }
  }

  isLegalMove(fromSq, toSq) {
    return true;
  }

  isPlayersMove() {
    return true;
  }

  getPiecesSetup() {
    // const pieces = {1: {color: 2, type: 'p', area: 'e2'}, };
    const piecesElements = this.element.querySelectorAll('.piece');
    const pieces = {};

    [...piecesElements].forEach((el, index) => {
      const background = el.getAttribute('style');

      const color = /b.\.png"/.test(background) ? 2 : 1;
      const type = background.match(/(.)\.png"/)[1];
      const area = coordsToSquare(el.className.match(/square-(\d+)/)[1]);

      pieces[index] = { color, type, area };
    });

    return pieces;
  }

  markArrow(fromSq, toSq) {
    const lineId = `ccHelper-arrow-${fromSq}${toSq}`;

    if (SVG.get(lineId)) {
      return;
    }

    const fromPosition = this._getSquarePosition(fromSq, false);
    const toPosition = this._getSquarePosition(toSq, false);

    // what if the board became bigger/smaller?
    const sizeRatio = this.element.clientWidth / this.viewSize;

    const boardGroup = SVG.get('board-group');
    const line = this
      .draw
      .line(
        fromPosition.x / sizeRatio,
        fromPosition.y / sizeRatio,
        toPosition.x / sizeRatio,
        toPosition.y / sizeRatio,
      )
      .stroke({
        width: this.element.clientWidth / 90 / sizeRatio,
        color: 'orange',
        opacity: 1,
      });

    boardGroup.add(line);
    line.id(lineId);
    line.attr({
      'class': 'arrow',
      'pointer-events': 'none'
    });

    line.marker('end', 4, 4, function(add) {
      add.polygon('0,0 0,4 4,2').fill('orange').opacity(1);
      this.ref(0,2);
    });
  }

  unmarkArrow(fromSq, toSq) {
    const lineId = `ccHelper-arrow-${fromSq}${toSq}`;
    if (SVG.get(lineId)) {
      SVG.get(lineId).remove();
    }
  }

  clearMarkedArrows() {
    const boardGroup = SVG.get('board-group');
    boardGroup.each((i, item) => {
      const id = get(item, '0.node.id');
      if (id && id.startsWith('ccHelper-arrow-')) {
        SVG.get(id).remove();
      }
    });
  }

  markArea(square) {
    // TODO: implement
  }

  unmarkArea(square) {}

  /**
   * Get position in pixels for some square
   * @param  {String}  square    in format a2
   * @param  {Boolean} absolute  if true, offset is made from document, otherwise from closest element
   * @return {Object}            coordinates, { x, y }
   */
  _getSquarePosition(square, absolute = true) {
    const isFlipped = this.element.classList.contains('flipped');
    const coords = squareToCoords(square).map((c) => Number(c));
    const { left, top, width } = this.element.getBoundingClientRect();
    const squareWidth = width / 8;
    const correction = squareWidth / 2;

    if (!isFlipped) {
      return {
        x: (absolute ? left : 0) + squareWidth * coords[0] - correction,
        y: (absolute ? top : 0) + width - squareWidth * coords[1] + correction,
      };
    } else {
      return {
        x: (absolute ? left : 0) + width - squareWidth * coords[0] + correction,
        y: (absolute ? top : 0) + squareWidth * coords[1] - correction,
      };
    }
  }
}

module.exports = VueChessboard;
