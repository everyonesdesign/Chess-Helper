/**
 * Global chessboard
 */

const MOUSE_BUTTONS = {
  no: 0,
  left: 1,
  middle: 2,
  right: 3,
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
  which = MOUSE_BUTTONS.left,
  x = 0,
  y = 0,
}) {
  element.dispatchEvent(new MouseEvent(name, {
    bubbles: true,
    cancelable: true,
    view: window,
    which,
    clientX: x,
    clientY: y,
  }));
}

class VueChessboard {
  constructor(element) {
    this.element = element;
  }

  getElement() {
    return this.element;
  }

  makeMove(fromSq, toSq) {
    this.markArrow(fromSq, toSq);
    this.markArea(toSq);

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
    const fromPosition = this._getSquarePosition(fromSq);
    dispatchMouseEvent(this.element, {
      name: 'mousedown',
      which: MOUSE_BUTTONS.right,
      x: fromPosition.x,
      y: fromPosition.y,
    });

    const toPosition = this._getSquarePosition(toSq);
    dispatchMouseEvent(this.element, {
      name: 'mouseup',
      which: MOUSE_BUTTONS.right,
      x: toPosition.x,
      y: toPosition.y,
    });
  }

  unmarkArrow(fromSq, toSq) {}

  clearMarkedArrows() {}

  markArea(square) {
    const position = this._getSquarePosition(square);
    dispatchMouseEvent(this.element, {
      name: 'click',
      which: MOUSE_BUTTONS.right,
      x: position.x,
      y: position.y,
    });
  }

  unmarkArea(square) {}

  _getSquarePosition(square) {
    const isFlipped = this.element.classList.contains('flipped');
    const coords = squareToCoords(square).map((c) => Number(c));
    const { left, top, width } = this.element.getBoundingClientRect();
    const squareWidth = width / 8;
    const correction = squareWidth / 2;

    if (!isFlipped) {
      return {
        x: left + squareWidth * coords[0] - correction,
        y: top + width - squareWidth * coords[1] + correction,
      };
    } else {
      return {
        x: left + width - squareWidth * coords[0] + correction,
        y: top + squareWidth * coords[1] - correction,
      };
    }
  }
}

module.exports = VueChessboard;
