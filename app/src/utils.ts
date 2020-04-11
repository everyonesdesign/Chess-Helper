import domify from 'domify';
import {
  ariaHiddenElements,
  blindfoldOverlays,
} from './globals';
import {
  blindFoldIcon,
} from './icons';
import {
  commands,
} from './commands';
import {
  IChessboard,
  TArea,
  Nullable,
  IConfig,
} from './types';

// value is stored inside of chessboard.rightClickMarkColors
export const RED_SQUARE_COLOR = '#f42a32';

/**
 * Is user holding Ctrl (on PC) or Cmd (on Mac)
 * @param {Event} e
 * @return {Boolean}
 */
export function holdingCtrlOrCmd(e: KeyboardEvent) {
  if (navigator.platform === 'MacIntel') {
    return e.metaKey;
  }

  return e.ctrlKey;
}

/**
 * Write some message to the user
 * @param {String} text - text of the message
 */
export function postMessage(text: string) {
  const messagesContainer = document.getElementById('ccHelper-messages');

  if (messagesContainer) {
    const message = document.createElement('div');
    message.className = 'ccHelper-messagesItem';
    message.textContent = text;
    messagesContainer.appendChild(message);

    setTimeout(() => {
      messagesContainer.removeChild(message);
    }, 3000);
  }
}

/**
 * Text if passed element can take some text input
 * @param  {Element}  element
 * @return {Boolean}
 */
export function isEditable(element: Nullable<Element>) : boolean {
  if (element) {
    return element.matches('input, textarea, [contenteditable]');
  }

  return false;
}

/**
 * Build basic markup for notification showing
 */
export function buildMessagesMarkup() {
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
export function isModifierPressed(e: KeyboardEvent) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
}

/**
 * Provide initial elements for the app
 * @return {Object}
 */
export function createInitialElements() {
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
  const input = <HTMLInputElement>wrapper.querySelector('#ccHelper-input');
  const unfocusedLabel = <HTMLElement>wrapper.querySelector('.ccHelper-label');

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
export function startUpdatingAriaHiddenElements() {
  const update = () => {
    const elements = Array.from(document.querySelectorAll('.chessboard'));
    elements.forEach((element) => {
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
export function initBlindFoldOverlay(board: IChessboard) {
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
        if (button) {
          button.addEventListener('click', () => commands.blindfold());
        }

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
export function squareToCoords(square: TArea) : string[] {
  const hor = '0' + ('abcdefgh'.indexOf(square[0]) + 1);
  const ver = '0' + square[1];
  return [hor, ver];
}

/**
 * Translate coords string to square
 * @param  {String} coords '0502'
 * @return {String}        'e2'
 */
export function coordsToSquare(coords: string) : TArea {
  const numbers = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return numbers[Number(coords.slice(1, 2))] + coords.slice(3, 4);
}

export const MOUSE_BUTTON = {
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
export function dispatchMouseEvent(
  element: Element,
  name: string,
  {
    button = MOUSE_BUTTON.left,
    x = 0,
    y = 0,
  } : { button?: number, x: number, y: number },
) {
  element.dispatchEvent(new MouseEvent(name, {
    bubbles: true,
    cancelable: true,
    view: window,
    button,
    clientX: x,
    clientY: y,
  }));
}

export function getConfig() : IConfig {
  return (<any>window).chessHelper__environment;
}
