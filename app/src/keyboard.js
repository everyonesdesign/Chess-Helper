const {
  getBoard,
  go,
} = require('./chess');
const {
  sendDataToAnalytics,
} = require('./analytics');
const {
  holdingCtrlOrCmd,
  isEditable,
} = require('./utils');

const KEY_CODES = {
  enter: 13,
  leftArrow: 37,
  topArrow: 38,
  rightArrow: 39,
  bottomArrow: 40,
  escape: 27,
};

/**
 * Bind hotkeys connected with focusing of the input
 * @param  {Element} input
 */
function bindInputFocus(input) {
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === KEY_CODES.escape && e.target !== input) {
      debugger;
      setTimeout(() => {
        document.activeElement.blur();
      });
    } else if (
      // latin & cyrillic
      /^[cс]$/i.test(e.key) &&
      e.target !== input &&
      !isEditable(e.target)
    ) {
      e.preventDefault();
      input.focus();

      sendDataToAnalytics({
        category: 'focused-from-keyboard',
        action: 'press',
      });
    }
  });
}

/**
 * Handle keyDown event on the input
 * Responsible for submitting move, backward/forward moves, etc.
 * @param  {Element} input
 */
function bindInputKeyDown(input) {
  input.addEventListener('keydown', (e) => {
    if (e.keyCode === KEY_CODES.enter) {
      const successfulMove = go(input.value);

      const board = getBoard();
      board && board.clearMarkedArrows();

      sendDataToAnalytics({
        category: 'enter',
        action: 'press',
        label: input.value,
      });

      if (successfulMove) {
        input.value = '';
      }

      input.focus();
    } else if (e.keyCode === KEY_CODES.escape) {
      input.value = '';

      const board = getBoard();
      board && board.clearMarkedArrows();
      e.preventDefault();
    } else if (holdingCtrlOrCmd(e)) {
      if (e.keyCode === KEY_CODES.leftArrow) {
        const sel = '.move-list-buttons .icon-chevron-left, .control-group .icon-chevron-left';
        document.querySelector(sel).parentNode.click();
      } else if (e.keyCode === KEY_CODES.rightArrow) {
        const sel = '.move-list-buttons .icon-chevron-right, .control-group .icon-chevron-right';
        document.querySelector(sel).parentNode.click();
      }
    }
  });
}

module.exports = {
  bindInputKeyDown,
  bindInputFocus,
};
