/// <reference types="cypress" />

/**
 * GAMES
 * Different chess games
 * (run on analysis board)
 */


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

  it('Opera night - UCI', function() {
    const position = this.positions['opera-night'];
    cy
      .playGame(position.movesUCI)
      .fenEquals(position.fen.end)
  });
});
