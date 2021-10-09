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

  it('Tal-Spassky', function() {
    const moves = [
      'c4',
      'Nf6',
      'Nc3',
      'e6',
      'd4',
      'c5',
      'd5',
      'exd5',
      'cxd5',
      'g6',
      'Nf3',
      'Bg7',
      'Bf4',
      'd6',
      'h3',
      'O-O',
      'e3',
      'Ne8',
      'Be2',
      'Nd7',
      'O-O',
      'Ne5',
      'Bxe5',
      'dxe5',
      'Nd2',
      'f5',
      'Qb3',
      'Nd6',
      'Nc4',
      'e4',
      'Nb5',
      'Nxb5',
      'Qxb5',
      'b6',
      'd6',
      'Bd7',
      'Qb3',
      'b5',
      'Nb6+',
      'c4',
      'Bxc4+',
      'bxc4',
      'Qxc4+',
      'Rf7',
      'Nxa8',
      'Qxa8',
      'Qb3',
      'Be5',
      'Rac1',
      'Kg7',
      'Rfd1',
      'a5',
      'Rc7',
      'Qe8',
      'Qd5',
      'a4',
      'b4',
      'axb3',
      'axb3',
      'Bf6',
      'Rb7',
      'Qe5',
      'Qc4',
      'f4',
      'exf4',
      'Qxf4',
      'g3',
      'Qf3',
      'Qd5',
      'Bc3',
      'Rf1',
      'Kh6',
      'Qd1',
      'Qf6',
      'Qe2',
      'Bd4',
      'Rb4',
      'e3',
      'Qd3',
      'Qxf2+',
      'Rxf2',
      'exf2+',
      'Kh2',
      'f1=N+',
      'Qxf1',
      'Rxf1',
      'Rxd4',
      'Rf2+',
      'Kg1',
      'Rf3',
    ];

    cy
      .playGame(moves)
      .fenEquals(this.positions['tal-spassky'].positions.end)
  });

  it('Opera night', function() {
    const moves = [
      'e4',
      'e5',
      'Nf3',
      'd6',
      'd4',
      'Bg4',
      'dxe5',
      'Bxf3',
      'Qxf3',
      'dxe5',
      'Bc4',
      'Nf6',
      'Qb3',
      'Qe7',
      'Nc3',
      'c6',
      'Bg5',
      'b5',
      'Nxb5',
      'cxb5',
      'Bxb5+',
      'Nbd7',
      'O-O-O',
      'Rd8',
      'Rxd7',
      'Rxd7',
      'Rd1',
      'Qe6',
      'Bxd7+',
      'Nxd7',
      'Qb8+',
      'Nxb8',
      'Rd8#',
    ];

    cy
      .playGame(moves)
      .fenEquals(this.positions['opera-night'].positions.end)
  });
});
