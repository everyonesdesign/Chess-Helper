/**
 * Prepare the extension code and run
 */
function init() {
  const selector = '.main-board .board, #chessboard';
  const boardElement = document.querySelector(selector);
  if (boardElement) {
    initAnalytics();

    const input = document.createElement('input');
    input.setAttribute('id', 'ccHelper-input');
    input.className = 'ccHelper-input';
    input.setAttribute('placeholder', 'Enter move here...');
    input.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        go(input.value);

        const board = getBoard();
        board && board.clearMarkedArrows();

        sendDataToAnalytics({
          category: 'enter',
          action: 'press',
          label: input.value,
        });

        input.value = '';
        input.focus();
      }
    });
    input.addEventListener('input', () => {
      const board = getBoard();
      const move = parseMoveText(input.value);

      if (board) {
        board.clearMarkedArrows();
        move && board.markArrow(...move);
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
    const move = parseMoveText(input);
    if (move) {
      makeMove(board, ...move);
    } else {
      sendDataToAnalytics({
        category: 'incorrect',
        action: 'input',
        label: input,
      });

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
    const move = fromField + '-' + toField;

    sendDataToAnalytics({
      category: 'illegal',
      action: 'input',
      label: move,
    });

    postMessage('Move "' + move + '" is illegal');
  }
}

/**
 * Init google analytics for the app
 */
function initAnalytics() {
  /* eslint-disable */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','cchGa');
  /* eslint-enable */

  window.cchGa('create', 'UA-110216390-1', 'auto', 'chessHelper');
  sendDataToAnalytics({
    category: 'init',
    action: 'init',
  });
}

/**
 * Send data to google analytics to make the extension better
 * @param  {String} category
 * @param  {String} action
 */
function sendDataToAnalytics({category, action, label}) {
  try {
    window.cchGa('chessHelper.send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
    });
  } catch (e) {}
}

init();
