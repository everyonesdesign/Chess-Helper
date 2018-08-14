const domify = require('domify');
const {
  ariaHiddenElements,
} = require('./globals');

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

module.exports = {
  holdingCtrlOrCmd,
  postMessage,
  isEditable,
  buildMessagesMarkup,
  isModifierPressed,
  RED_SQUARE_COLOR,
  createInitialElements,
  startUpdatingAriaHiddenElements,
};
