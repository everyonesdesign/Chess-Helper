/**
 * Global chessboard
 */

function squareToCoords(square) {
  const hor = '0' + ('abcdefgh'.indexOf(square[0]) + 1);
  const ver = '0' + square[1];
  return [hor, ver];
}

function coordsToSquare(coords) {
  const numbers = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return numbers[coords.slice(1, 2)] + coords.slice(3, 4);
}

class VueChessboard {
  constructor(element) {
    this.element = element;
  }

  getElement() {
    return this.element;
  }

  makeMove(fromAreaId, targetAreaId) {
    const { left, top, width, height } = this.element.getBoundingClientRect();

    const fromCoords = squareToCoords(fromAreaId);
    const piece = this.element.querySelector(`.piece.square-${fromCoords.join('')}`);
    if (piece) {
      alert('at least im here');
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

  markArrow(fromSq, toSq) {}

  unmarkArrow(fromSq, toSq) {}

  clearMarkedArrows() {}

  markArea(coord) {}

  unmarkArea(coord) {}
}

module.exports = VueChessboard;
