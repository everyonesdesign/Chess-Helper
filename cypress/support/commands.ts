/// <reference types="../support" />

import { INPUT_SELECTOR } from '../constants';

const DEFAULT_MOVE_OPTIONS = {
  delay: 100,
}

Cypress.Commands.add('playGame', (moves: string[]) => {
  cy.wrap(moves).each((move: string) => {
      cy.makeMove(move);
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
    .get('chess-board, wc-chess-board')
    // @ts-ignore
    .then($chessboard => $chessboard[0].game.getPosition().fen)
    .should('eq', expectedFen)
})

Cypress.Commands.add('setAnalysisFen', (fen) => {
  const SHORT_DELAY = 50;
  return cy
    .contains('Load From FEN/PGN(s)')
    .click()
    .wait(SHORT_DELAY)
    .get('[aria-label^="Paste one or more PGNs"]')
    .type(`${fen}{enter}`)
    .get('[data-cy="add-games-btn"], .load-from-pgn-component .cc-button-primary')
    .click()
    .wait(SHORT_DELAY)
})

Cypress.Commands.add('flipBoard', () => {
  cy.get('body').type('x');
})

Cypress.Commands.add('acceptCookies', () => {
  return cy.window().then((win) => {
    try {
      const SELECTOR = '.accept-button, .bottom-banner-close, .osano-cm-save, #onetrust-reject-all-handler';
      const buttons = win.document.querySelectorAll(SELECTOR);
      buttons.forEach(b => {
        const button = b as HTMLButtonElement;
        button.click();
      });
    } catch(e) {}
  })
})

Cypress.Commands.add('enablePuzzleBoard', () => {
  return cy.window().then((win) => {
    const element = win.document.querySelector('chess-board, wc-chess-board');
    // @ts-ignore
    const game = element.game;

    game.setOptions({ enabled: true })

    const mode = game.getMode();
    mode.isAllowedToMove = () => true;
    const options = mode.getOptions();

    options.canModifyExistingMovesOnMainLine = true;
    options.canInteractWithPieces = true;
    options.canAddMovesToMainLine = true;

    game.canMoveForward = () => true;
    game.getTurn = () => game.getPlayingAs();
  })
})
