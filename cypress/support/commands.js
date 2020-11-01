/// <reference types="cypress" />

const { INPUT_SELECTOR } = require('../constants');

const addExtensionCommands = require('cypress-browser-extension-plugin/commands')
addExtensionCommands(Cypress)

const DEFAULT_MOVE_OPTIONS = {
  delay: 100,
}
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
