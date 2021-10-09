/// <reference types="cypress" />

/**
 * GAMES
 * Different chess games
 * (run on analysis board)
 */

const { INPUT_SELECTOR } = require('../constants');

const ARROW_SELECTOR = 'img.chessBoardArrow';
const E2E4_ARROW_SELECTOR = 'chess-board .arrows [data-arrow="e2e4"]';
const SQUARE_SELECTOR = 'chess-board [class^="highlight square-"][style*="background-color: rgb(235, 97, 80)"]';

context('Chess games', () => {
  beforeEach(() => {
    cy.visit('https://www.chess.com/analysis')
    cy.wait(10000)
    cy.fixture('positions').as('positions')
  });

  it('Tal-Spassky - algebraic', function() {
    const position = this.positions['tal-spassky'];
    cy
      .playGame(position.movesAlgebraic)
      .fenEquals(position.fen.end)
  });

  it('Opera night - algebraic', function() {
    const position = this.positions['opera-night'];
    cy
      .playGame(position.movesAlgebraic)
      .fenEquals(position.fen.end)
  });

  it('Opera night - algebraic lower', function() {
    const position = this.positions['opera-night'];
    cy
      .playGame(position.movesAlgebraic.map(i => i.toLowerCase()))
      .fenEquals(position.fen.end)
  });
});
