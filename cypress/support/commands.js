/// <reference types="cypress" />

const { INPUT_SELECTOR } = require('../constants');

const DEFAULT_MOVE_OPTIONS = {
  delay: 100,
}

Cypress.Commands.add('playGame', (moves) => {
  cy.wrap(moves).each((move) => {
      cy.makeMove(move)
  })
})

Cypress.Commands.add('makeMove', (move, options = {}) => {
  const opts = Object.assign({}, options, DEFAULT_MOVE_OPTIONS)
  return cy
    .get(INPUT_SELECTOR)
    .clear()
    .type(`${move}{enter}`)
    .blur()
    .wait(opts.delay)
})

Cypress.Commands.add('fenEquals', (expectedFen) => {
  return cy
    .get('chess-board')
    .then($chessboard => $chessboard[0].game.getPosition().fen)
    .should('eq', expectedFen)
})

Cypress.Commands.add('flipBoard', () => {
  cy.get('body').type('x');
})

Cypress.Commands.add('acceptCookies', () => {
  return cy.window().then((win) => {
    try {
      const SELECTOR = '.accept-button, .bottom-banner-close';
      const buttons = win.document.querySelectorAll(SELECTOR);
      buttons.forEach(b => b.click());
    } catch(e) {}
  })
})

Cypress.Commands.add('enablePuzzleBoard', () => {
  return cy.window().then((win) => {
    const element = win.document.querySelector('chess-board');

    element.game.setOptions({ enabled: true })

    const mode = element.game.getMode();
    mode.isAllowedToMove = () => true;
    const options = mode.getOptions();

    options.canModifyExistingMovesOnMainLine = true;
    options.canInteractWithPieces = true;
    options.canAddMovesToMainLine = true;

    element.game.canMoveForward = () => true;
    element.game.getTurn = () => element.game.getPlayingAs();
  })
})
