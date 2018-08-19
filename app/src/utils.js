const domify = require('domify');
const {
  ariaHiddenElements,
  blindfoldOverlays,
} = require('./globals');
const {
  blindFoldIcon,
} = require('./icons');
const {
  commands,
} = require('./commands');

// value is stored inside of chessboard.rightClickMarkColors
const RED_SQUARE_COLOR = '#f42a32';

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
 * Text if passed element can take some text input
 * @param  {Element}  element
 * @return {Boolean}
 */
function isEditable(element) {
  return element.matches('input, textarea, [contenteditable]');
}

/**
 * Build basic markup for notification showing
 */
function buildMessagesMarkup() {
  const messages = document.createElement('div');
  messages.setAttribute('id', 'ccHelper-messages');
  messages.className = 'ccHelper-messages';
  document.body.appendChild(messages);
}

/**
 * Is modifier key pressed during keydown
 * (ctrl/shift/meta/alt)
 * @param {KeybaordEvent} e
 * @return {Boolean}
 */
function isModifierPressed(e) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
}

/**
 * Provide initial elements for the app
 * @return {Object}
 */
function createInitialElements() {
  const wrapper = domify(`
    <div class="ccHelper-wrapper">
      <input
        type="text"
        class="ccHelper-input"
        id="ccHelper-input"
        placeholder="Enter your move or type / to see commands..."
      >
      <div class="ccHelper-label" aria-hidden="true"></div>
    </div>
  `);
  const input = wrapper.querySelector('#ccHelper-input');
  const unfocusedLabel = wrapper.querySelector('.ccHelper-label');

  return {
    wrapper,
    input,
    unfocusedLabel,
  };
}

/**
 * Chessboard markup is a mess
 * This function hides it from screen readers
 * @param  {ChessBoard} board
 */
function startUpdatingAriaHiddenElements() {
  const update = () => {
    const elements = document.querySelectorAll('.chessboard');
    [...elements].forEach((element) => {
      if (!ariaHiddenElements.get(element)) {
        element.setAttribute('aria-hidden', 'true');
        ariaHiddenElements.set(element, true);
      }
    });
  };

  update();
  setInterval(update, 1000);
}

/**
 * Create a blindfold overlay for a board element
 * @param  {ChessBoard} board
 */
function initBlindFoldOverlay(board) {
  const existingOverlay = blindfoldOverlays.get(board);
  if (!existingOverlay) {
    const container = board.getRelativeContainer();
    if (container) {
      if (container) {
        const overlay = domify(`
          <div class="ccHelper-blindfold">
            <div class="ccHelper-blindfoldPeek">
              <div class="ccHelper-blindfoldPeekContents">
                Hover here or hold <span class="ccHelper-blindfoldKey">Ctrl</span> to peek
              </div>
            </div>
            <div class="ccHelper-blindfoldBackground"></div>
            <div class="ccHelper-blindfoldTitle">
              Blindfold mode is on
            </div>
            ${blindFoldIcon}
            <button class="ccHelper-blindfoldButton">
              Click here or type /blindfold to toggle
            </button>
          </div>
        `);

        // toggle blindfold mode on button click...
        const button = overlay.querySelector('.ccHelper-blindfoldButton');
        button.addEventListener('click', () => commands.blindfold());

        blindfoldOverlays.set(board, overlay);
        container.appendChild(overlay);
      } else {
        // maybe set some dummy value to `blindfoldOverlays` set
        // to optimise this function?
      }
    }
  }
}

/**
 * Translate square string to coords
 * @param  {String} square e2
 * @return {Array<String>} ['05','02']
 */
function squareToCoords(square) {
  const hor = '0' + ('abcdefgh'.indexOf(square[0]) + 1);
  const ver = '0' + square[1];
  return [hor, ver];
}

/**
 * Translate coords string to square
 * @param  {String} coords '0502'
 * @return {String}        'e2'
 */
function coordsToSquare(coords) {
  const numbers = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return numbers[coords.slice(1, 2)] + coords.slice(3, 4);
}

const MOUSE_WHICH = {
  no: 0,
  left: 1,
  middle: 2,
  right: 3,
};

const MOUSE_BUTTON = {
  left: 0,
  right: 2,
};

/**
 * Simulate mouse event
 * @param  {Element} element
 * @param  {String} options.name
 * @param  {Number} options.which
 * @param  {Number} options.button
 * @param  {Number} options.x
 * @param  {Number} options.y
 * @param  {Object} options
 */
function dispatchMouseEvent(element, {
  name,
  which = MOUSE_WHICH.left,
  button = MOUSE_BUTTON.left,
  x = 0,
  y = 0,
}) {
  element.dispatchEvent(new MouseEvent(name, {
    bubbles: true,
    cancelable: true,
    view: window,
    which,
    buttons: which,
    clientX: x,
    clientY: y,
  }));
}

module.exports = {
  holdingCtrlOrCmd,
  postMessage,
  isEditable,
  buildMessagesMarkup,
  isModifierPressed,
  RED_SQUARE_COLOR,
  createInitialElements,
  startUpdatingAriaHiddenElements,
  initBlindFoldOverlay,
  squareToCoords,
  coordsToSquare,
  dispatchMouseEvent,
  MOUSE_WHICH,
  MOUSE_BUTTON,
};
