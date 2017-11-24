/**
 * Prepare the extension code and run
 */
function init() {
  const selector = '.main-board .board, #chessboard';
  const boardElement = document.querySelector(selector);
  if (boardElement) {
    boardElement.appendChild(createInput());
  }
}

/**
 * Create the field to handle the moves input
 * @return {HTMLInputElement} - input handling the user input
 */
function createInput() {
  const input = document.createElement('input');
  input.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      go(input.value);
      input.value = '';
      input.focus();
    }
  });
  return input;
}

/**
 * Handle user input and act in appropriate way
 * The function uses active board on the screen if there's any
 * @param  {String} input - input, in format 'e2e4'
 */
function go(input) {
  try {
    makeMove(myEvent.capturingBoard, input.slice(0, 2), input.slice(2, 4));
  } catch (e) {
    alert('Move is illegal');
  }
}

/**
 * Check move and make it if it's legal
 * This function relies on chess.com chessboard interface
 * @param  {ChessBoard} board - chessboard instance
 * @param  {String} fromField - starting field, e.g. 'e2'
 * @param  {String} toField   - ending field, e.g. 'e4'
 */
function makeMove(board, fromField, toField) {
  if (board.gameRules.isLegalMove(board.gameSetup, fromField, toField)) {
      board.fireEvent('onDropPiece', {
          fromAreaId: fromField,
          targetAreaId: toField,
      });
  } else {
    throw new Error('Move is illegal');
  }
}

init();
