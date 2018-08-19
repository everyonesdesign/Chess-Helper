const {
  go,
} = require('./chess');
const {
  getBoard,
} = require('./chessboard');
const {
  sendDataToAnalytics,
} = require('./analytics');
const {
  holdingCtrlOrCmd,
  isEditable,
  isModifierPressed,
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
    if (isModifierPressed(e)) {
      // prevent native events from being prevented
      // e.g. Ctrl + C
      return;
    }

    if (e.keyCode === KEY_CODES.escape && e.target !== input) {
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
    e.stopPropagation();

    if (e.keyCode === KEY_CODES.enter) {
      if (!input.value) {
        return;
      }

      const board = getBoard();

      if (board) {
        const success = go(board, input.value);
        board && board.clearMarkedArrows();

        sendDataToAnalytics({
          category: 'enter',
          action: 'press',
          label: input.value,
        });

        if (success) {
          input.value = '';

          // needed to remove autocomplete
          // after successful command execution
          setTimeout(() => {
            const event = new Event('keyup');
            input.dispatchEvent(event);
          }, 200);
        }
      }

      input.focus();
    } else if (e.keyCode === KEY_CODES.escape) {
      input.value = '';

      const board = getBoard();
      board && board.clearMarkedArrows();
      e.preventDefault();
    } else if (holdingCtrlOrCmd(e)) {
      if (e.keyCode === KEY_CODES.leftArrow) {
        const sel = `
          .move-list-buttons .icon-chevron-left,
          .control-group .icon-chevron-left,
          .move-list-buttons-component .icon-chevron-left
        `;
        document.querySelector(sel).click();
      } else if (e.keyCode === KEY_CODES.rightArrow) {
        const sel = `
          .move-list-buttons .icon-chevron-right,
          .control-group .icon-chevron-right,
          .move-list-buttons-component .icon-chevron-right
        `;
        document.querySelector(sel).click();
      }
    }
  });
}

/**
 * Bind keyboards listeners to peek from keyboard
 * in blindfold mode
 */
function bindBlindFoldPeek() {
  const updatePeekClass = (e) => {
    document.body.classList.toggle('ccHelper-docBody--peeked', !!e.ctrlKey);
  };
  document.body.addEventListener('keydown', updatePeekClass);
  document.body.addEventListener('keyup', updatePeekClass);
}

module.exports = {
  bindInputKeyDown,
  bindInputFocus,
  bindBlindFoldPeek,
};
