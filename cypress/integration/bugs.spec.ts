/// <reference types="../support" />

/**
 * BUGS
 * Checking specific issues encountered before
 */

function testFenToFen({
  cy,
  initialFen,
  expectedFen,
  move,
}: {
  cy: Cypress.Chainable,
  initialFen: string,
  expectedFen: string,
  move: string,
}) {
  cy.visit('https://www.chess.com/analysis')
  cy.wait(4000)
  cy.acceptCookies()

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
    it('Puzzles promotion (algebraic - queen)', function () {
      testFenToFen({
        cy,
        initialFen: '1r6/P4kp1/4p3/2p1p1p1/P3P1P1/8/5PK1/8 w - - 1 36',
        move: 'b8=Q',
        expectedFen: '1Q6/5kp1/4p3/2p1p1p1/P3P1P1/8/5PK1/8 b - - 0 36',
      });
    });

    it('Puzzles promotion (UCI - queen)', function () {
      testFenToFen({
        cy,
        initialFen: '1r6/P4kp1/4p3/2p1p1p1/P3P1P1/8/5PK1/8 w - - 1 36',
        move: 'a7b8q',
        expectedFen: '1Q6/5kp1/4p3/2p1p1p1/P3P1P1/8/5PK1/8 b - - 0 36',
      });
    });

    it('Puzzles promotion (algebraic - knight)', function () {
      testFenToFen({
        cy,
        initialFen: '1r6/P4kp1/4p3/2p1p1p1/P3P1P1/8/5PK1/8 w - - 1 36',
        move: 'b8=N',
        expectedFen: '1N6/5kp1/4p3/2p1p1p1/P3P1P1/8/5PK1/8 b - - 0 36',
      });
    });

    it('Puzzles promotion (UCI - knight)', function () {
      testFenToFen({
        cy,
        initialFen: '1r6/P4kp1/4p3/2p1p1p1/P3P1P1/8/5PK1/8 w - - 1 36',
        move: 'a7b8n',
        expectedFen: '1N6/5kp1/4p3/2p1p1p1/P3P1P1/8/5PK1/8 b - - 0 36',
      });
    });
  });

  context('Pawn vs bishop algebraic notation', () => {
    // https://www.chess.com/forum/view/general/keyboard-controls-for-chess-com-chess-com-keyboard-browser-extension?newCommentCount=1&page=2#comment-64840439

    it("Moves like `bb3` prefer bishop if in conflict with pawn", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqk1nr/pppp1ppp/4p3/2b5/2B5/4P3/PPPP1PPP/RNBQK1NR w KQkq - 2 3',
        move: 'bb3',
        expectedFen: 'rnbqk1nr/pppp1ppp/4p3/2b5/8/1B2P3/PPPP1PPP/RNBQK1NR b KQkq - 3 3',
      });
    });

    it("Moves like `b2b4` prefer UCI over a bishop in conflicts", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqk1nr/ppp3pp/3p4/2b1pp2/8/3PP3/PPPBBPPP/RN1QK1NR w KQkq - 0 7',
        move: 'b2b4',
        expectedFen: 'rnbqk1nr/ppp3pp/3p4/2b1pp2/1P6/3PP3/P1PBBPPP/RN1QK1NR b KQkq b3 0 7',
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

    it("Moves like `cc3` are pawn moves", function () {
      testFenToFen({
        cy,
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: 'cc3',
        expectedFen: 'rnbqkbnr/pppppppp/8/8/8/2P5/PP1PPPPP/RNBQKBNR b KQkq - 0 1',
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
