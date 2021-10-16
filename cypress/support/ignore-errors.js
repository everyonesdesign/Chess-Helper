/// <reference types="cypress" />

/**
 * Ignore uncaught errors
 * Otherwise chess.com errors make the e2e tests fail
 *
 * Chess Helper tests then should only cover its own functionality
 */
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
