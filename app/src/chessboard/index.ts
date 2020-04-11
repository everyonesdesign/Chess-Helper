import forEach from 'lodash/forEach';
import { GlobalChessboard } from './global-chessboard';
import { VueChessboard } from './vue-chessboard';
import {
  boards,
} from '../globals';
import {
  Nullable,
  IChessboard,
} from '../types';

export { GlobalChessboard } from './global-chessboard';
export { VueChessboard } from './vue-chessboard';

export function getBoard() : Nullable<IChessboard> {
  const element = document.querySelector('.chessboard, .board');

  if (element) {
    const existingBoard = boards.get(element);
    if (existingBoard) {
      return existingBoard;
    }

    const boardSelectorMappings = {
      '.chessboard': GlobalChessboard,
      '.board': VueChessboard,
    };

    let board = null;

    forEach(boardSelectorMappings, (Constructor, selector) => {
      if (element.matches(selector)) {
        board = new Constructor(element);
        // exit loop
        return false;
      }
    });

    if (board) {
      boards.set(element, board);
    }

    return board;
  }

  return null;
}


