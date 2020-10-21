/// <reference types="cypress" />

/**
 * PLAY WITH COMPUTER VIEW
 * This view relies on vue chessboard implementation
 * (vue-chessboard module)
 */

const { INPUT_SELECTOR } = require('../constants');

const ARROW_SELECTOR = 'img.chessBoardArrow';
const E2E4_ARROW_SELECTOR = 'img.chessBoardArrow[src$="//images.chesscomfiles.com/chess-themes/arrows/75/u-3.png"]';
const SQUARE_SELECTOR = '[style*="background-color: rgb(244, 42, 50)"]:not([style*="opacity: 0;"])';

context('Play with computer page', () => {
  it('highlights arrows and squares', function() {
    cy.visit('https://www.chess.com/play/computer')

    cy.wait(10000)

    cy
      .get('#newbie-modal button.close')
      .click();

    cy
      .get(ARROW_SELECTOR)
      .should('not.exist')

    cy
      .get(SQUARE_SELECTOR)
      .should('not.exist')

    cy
      .get(INPUT_SELECTOR)
      .should('have.value', '')

    cy
      .get(INPUT_SELECTOR)
      .type('e4')

    cy
      .get(E2E4_ARROW_SELECTOR)
      .should('exist')

    cy
      .get(INPUT_SELECTOR)
      .clear()
    cy
      .get(ARROW_SELECTOR)
      .should('not.exist')

    cy
      .get(INPUT_SELECTOR)
      .type('e2e4')

    cy
      .get(E2E4_ARROW_SELECTOR)
      .should('exist')

    cy
      .get(INPUT_SELECTOR)
      .clear()
      .type('e4{enter}')
      .wait(2000)
      .type('Nc3{enter}')
      .wait(2000)
      .type('Ne2')

    cy
      .get(SQUARE_SELECTOR)
      .should('have.length', 2)

    cy
      .get(INPUT_SELECTOR)
      .clear()
      .type('Nfe2')

    cy
      .get(SQUARE_SELECTOR)
      .should('not.exist')
  });
});
