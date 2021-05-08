/// <reference types="cypress" />

/**
 * BUGS
 * Checking specific issues encountered before
 */

const { INPUT_SELECTOR } = require('../constants');

const ARROW_SELECTOR = 'img.chessBoardArrow';
const PREV_MOVE_SELECTOR = '.prev-next-arrows-icon';

context('Bugs', () => {
  beforeEach(() => {
    cy.fixture('positions').as('positions')
  });

  it('Puzzles promotion', function() {
    // See https://github.com/everyonesdesign/Chess-Helper/issues/34
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
      .makeMove('b8=Q')
      .get(PREV_MOVE_SELECTOR)
        .first()
        .click()

    cy
      .makeMove('b8')
      .makeMove('b8=Q')
      .fenEquals(this.positions['puzzles-promotion'].positions.end)
  });
});
