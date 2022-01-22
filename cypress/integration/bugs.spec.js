/// <reference types="cypress" />

/**
 * BUGS
 * Checking specific issues encountered before
 */

const { INPUT_SELECTOR } = require('../constants');

const ARROW_SELECTOR = 'img.chessBoardArrow';
const PREV_MOVE_SELECTOR = '.prev-next-arrows-icon';

function testPuzzlePromotion(cy, isAlgebraic) {
  const promotionMoveBase = isAlgebraic ? 'b8' : 'a7b8';
  const promotionSuffix = isAlgebraic ? '=Q' : 'q';

  cy.visit(this.positions['puzzles-promotion'].url)
  cy.wait(2000)
  cy.acceptCookies(2000)
  cy.enablePuzzleBoard();
  cy.wait(2000)

  cy
    .makeMove('c4')
    .makeMove('b6')
    .makeMove('c3')
    .makeMove('a7')
    .makeMove('Rb8')
    .makeMove(`${promotionMoveBase}${promotionSuffix}`)
    .get(PREV_MOVE_SELECTOR)
      .first()
      .click()

  cy
    .makeMove(promotionMoveBase)
    .makeMove(`${promotionMoveBase}${promotionSuffix}`)
    .fenEquals(this.positions['puzzles-promotion'].fen.end)
}

function testFenToFen({
  cy,
  initialFen,
  expectedFen,
  move,
}) {
  cy.visit('https://www.chess.com/analysis')
  cy.wait(2000)
  cy.acceptCookies(2000)

  cy
    .setAnalysisFen(initialFen)
    .makeMove(move)
    .fenEquals(expectedFen)
}


context('Bugs', () => {
  beforeEach(() => {
    cy.fixture('positions').as('positions')
  });

  context('Promotion in puzzles', () => {
    // See https://github.com/everyonesdesign/Chess-Helper/issues/34
    it('Puzzles promotion (algebraic)', function () {
      testPuzzlePromotion.call(this, cy, true);
    });

    it('Puzzles promotion (UCI)', function () {
      testPuzzlePromotion.call(this, cy, false);
    });
  });

  context('Pawn vs bishop algebraic notation', () => {
    // https://www.chess.com/forum/view/general/keyboard-controls-for-chess-com-chess-com-keyboard-browser-extension?newCommentCount=1&page=2#comment-64840439

    it("Moves like `bb3` are condidered bishop-only moves", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqk1nr/pppp1ppp/4p3/2b5/2B5/4P3/PPPP1PPP/RNBQK1NR w KQkq - 2 3',
        move: 'bb3',
        expectedFen: 'rnbqk1nr/pppp1ppp/4p3/2b5/8/1B2P3/PPPP1PPP/RNBQK1NR b KQkq - 3 3',
      });
    });

    it("Moves like `b3` should be used for non-capture pawn moves", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: 'b3',
        expectedFen: 'rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR b KQkq - 0 1',
      });
      });

    it("Moves like `bc4` are resolved in favour of pawn if bishop and pawn can capture", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqkbnr/pp1ppppp/8/8/2p1P3/1P6/P1PP1PPP/RNBQKBNR w KQkq - 0 3',
        move: 'bc4',
        expectedFen: 'rnbqkbnr/pp1ppppp/8/8/2P1P3/8/P1PP1PPP/RNBQKBNR b KQkq - 0 3',
      });
    });

    it("Moves like `cc3` are illegal moves", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: 'cc3',
        expectedFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      });
    });

    it("`bc4` is executed if not ambiguous (pawn)", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqkbnr/pp1ppppp/8/8/2p4P/1P6/P1PPPPP1/RNBQKBNR w KQkq - 0 3',
        move: 'bc4',
        expectedFen: 'rnbqkbnr/pp1ppppp/8/8/2P4P/8/P1PPPPP1/RNBQKBNR b KQkq - 0 3',
      });
    });

    it("`bc4` is executed if not ambiguous (bishop)", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqkbnr/pp1ppppp/8/4P3/2p5/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3',
        move: 'bc4',
        expectedFen: 'rnbqkbnr/pp1ppppp/8/4P3/2B5/8/PPPP1PPP/RNBQK1NR b KQkq - 0 3',
      });
    });

    // Test case: r3r3/p1k2pBp/Qpp3b1/6P1/8/2b2P1B/PP1P2KP/R7 w - - 0 1
    // @see https://github.com/everyonesdesign/Chess-Helper/issues/51
    it("`bc3` moves pawn", function () {
      testFenToFen({
        cy,
        initialFen: 'r3r3/p1k2pBp/Qpp3b1/6P1/8/2b2P1B/PP1P2KP/R7 w - - 0 1',
        move: 'bc3',
        expectedFen: 'r3r3/p1k2pBp/Qpp3b1/6P1/8/2P2P1B/P2P2KP/R7 b - - 0 1',
      });
    });

    it("`Bc3` moves bishop", function () {
      testFenToFen({
        cy,
        initialFen: 'r3r3/p1k2pBp/Qpp3b1/6P1/8/2b2P1B/PP1P2KP/R7 w - - 0 1',
        move: 'Bc3',
        expectedFen: 'r3r3/p1k2p1p/Qpp3b1/6P1/8/2B2P1B/PP1P2KP/R7 b - - 0 1',
      });
    });

    it("c3 is ambigious", function () {
      testFenToFen({
        cy,
        initialFen: 'r3r3/p1k2pBp/Qpp3b1/6P1/8/2b2P1B/PP1P2KP/R7 w - - 0 1',
        move: 'c3',
        expectedFen: 'r3r3/p1k2pBp/Qpp3b1/6P1/8/2b2P1B/PP1P2KP/R7 w - - 0 1',
      });
    });

    it("dc3 moves d pawn", function () {
      testFenToFen({
        cy,
        initialFen: 'r3r3/p1k2pBp/Qpp3b1/6P1/8/2b2P1B/PP1P2KP/R7 w - - 0 1',
        move: 'dc3',
        expectedFen: 'r3r3/p1k2pBp/Qpp3b1/6P1/8/2P2P1B/PP4KP/R7 b - - 0 1',
      });
    });
  });
});
