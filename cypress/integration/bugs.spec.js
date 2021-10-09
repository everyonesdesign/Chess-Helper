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
    .makeMove(`${promotionMoveBase}=Q`)
    .get(PREV_MOVE_SELECTOR)
      .first()
      .click()

  cy
    .makeMove(promotionMoveBase)
    .makeMove(`${promotionMoveBase}=Q`)
    .fenEquals(this.positions['puzzles-promotion'].fen.end)
}

context('Bugs', () => {
  beforeEach(() => {
    cy.fixture('positions').as('positions')
  });

  it('Puzzles promotion (algebraic)', function() {
    // See https://github.com/everyonesdesign/Chess-Helper/issues/34
    testPuzzlePromotion.call(this, cy, true);
  });

  it('Puzzles promotion (UCI)', function() {
    // See https://github.com/everyonesdesign/Chess-Helper/issues/34
    testPuzzlePromotion.call(this, cy, false);
  });
});
