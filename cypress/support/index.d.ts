/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    playGame(moves: string[]): Chainable<void>;
    makeMove(move: string): Chainable<void>;
    flipBoard(): Chainable<void>;
    setAnalysisFen(fen: string): Chainable<void>;
    fenEquals(fen: string): Chainable<void>;
    acceptCookies(delay: number): Chainable<void>;
  }
}
