let highlightedMove = [];

/**
 * Prepare the extension code and run
 */
function init() {
  const selector = '.main-board .board, #chessboard';
  const boardElement = document.querySelector(selector);
  if (boardElement) {
    const input = document.createElement('input');
    input.setAttribute('id', 'ccHelper-input');
    input.className = 'ccHelper-input';
    input.setAttribute('placeholder', 'Enter move here...');
    input.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        go(input.value);
        input.value = '';
        input.focus();
      }
    });
    input.addEventListener('input', () => {
      debugger;
      const board = getBoard();
      const move = parseMoveText(input.value);
      if (board && move) {
        highlightedMove.forEach((sq) => board.unmarkArea(sq));
        highlightedMove = move;

        board.markArea(move[0], '#99ee99');
        board.markArea(move[1], '#9999ee');
      } else {
        highlightedMove.forEach((sq) => board.unmarkArea(sq));
        highlightedMove = [];
      }
    });
    boardElement.appendChild(input);

    const messages = document.createElement('div');
    messages.setAttribute('id', 'ccHelper-messages');
    messages.className = 'ccHelper-messages';
    document.body.appendChild(messages);
  }
}

/**
 * Write some message to the user
 * @param {String} text - text of the message
 */
function postMessage(text) {
  const messagesContainer = document.getElementById('ccHelper-messages');
  const message = document.createElement('div');
  message.className = 'ccHelper-messagesItem';
  message.textContent = text;
  messagesContainer.appendChild(message);

  setTimeout(() => {
    messagesContainer.removeChild(message);
  }, 3000);
}

/**
 * Check if input is valid square name
 * @param  {String} input
 * @return {Boolean}
 */
function validateSquareName(input) {
  return /^\\w\\d$/.test(input);
}

/**
 * Parse message input by user
 * @param  {String} input - input, in format 'e2e4'
 * @return {Array?} - array of two elemens: from and to; or null if there's no move
 */
function parseMoveText(input) {
  const filteredSymbols = input.replace(/( |-)+/g, '');
  const fromSquare = filteredSymbols.slice(0, 2);
  const toSquare = filteredSymbols.slice(2, 4);

  if (validateSquareName(fromSquare) && validateSquareName(toSquare)) {
    return [fromSquare, toSquare];
  }

  return null;
}

/**
 * Get active board instance
 * @return {ChessBoard?}
 */
function getBoard() {
  const computerBoard = window.myEvent.capturingBoard;
  if (computerBoard) {
    return computerBoard;
  }

  if (window.boardsService && window.boardsService.getSelectedBoard) {
    const activeBoard = window.boardsService.getSelectedBoard();

    if (activeBoard) {
      return activeBoard.chessboard;
    }
  }

  return null;
}

/**
 * Handle user input and act in appropriate way
 * The function uses active board on the screen if there's any
 * @param  {String} input - input, in format 'e2e4'
 */
function go(input) {
  const board = getBoard();
  if (board) {
    debugger;
    const move = parseMoveText(input);
    if (move) {
      makeMove(board, ...move);
    } else {
      postMessage('Incorrect move: ' + input);
    }
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
    postMessage('Move "' + fromField + '-' + toField + '" is illegal');
  }
}

init();
