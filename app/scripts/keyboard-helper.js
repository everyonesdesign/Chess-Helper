const KEY_CODES = {
  enter: 13,
  leftArrow: 37,
  topArrow: 38,
  rightArrow: 39,
  bottomArrow: 40,
  escape: 27,
};

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
    input.addEventListener('keydown', handleKeyDown);
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
 * Handle keyDown event on the input
 * Responsible for submitting move, backward/forward moves, etc.
 * @param  {Event} e
 */
function handleKeyDown(e) {
  const input = e.target;

  if (e.keyCode === KEY_CODES.enter) {
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
  } else if (e.keyCode === KEY_CODES.escape) {
    input.value = '';

    const board = getBoard();
    board && board.clearMarkedArrows();
  } else if (holdingCtrlOrCmd(e)) {
    if (e.keyCode === KEY_CODES.leftArrow) {
      const selector = '.move-list-buttons .icon-chevron-left, .control-group .icon-chevron-left';
      document.querySelector(selector).parentNode.click();
    } else if (e.keyCode === KEY_CODES.rightArrow) {
      const selector = '.move-list-buttons .icon-chevron-right, .control-group .icon-chevron-right';
      document.querySelector(selector).parentNode.click();
    }
  }
}

/**
 * Is user holding Ctrl (on PC) or Cmd (on Mac)
 * @param {Event} e
 * @return {Boolean}
 */
function holdingCtrlOrCmd(e) {
  if (navigator.platform === 'MacIntel') {
    return e.metaKey;
  }

  return e.ctrlKey;
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
  return /^[a-h][1-8]$/.test(input);
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
      makeMove(move[0], move[1]);
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
 * @param  {String} fromField - starting field, e.g. 'e2'
 * @param  {String} toField   - ending field, e.g. 'e4'
 */
function makeMove(fromField, toField) {
  const board = getBoard();
  if (board.gameRules.isLegalMove(board.gameSetup, fromField, toField)) {
      board._clickedPieceElement = fromField;
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
