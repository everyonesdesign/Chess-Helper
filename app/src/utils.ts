import domify from 'domify';
import {
  ariaHiddenElements,
} from './globals';
import {
  TArea,
  Nullable,
  IConfig,
} from './types';
import { i18n } from './i18n';

// value is stored inside of chessboard.rightClickMarkColors
export const RED_SQUARE_COLOR = '#f42a32';

export function combineStringArrays(a: string[], b: string[]) : string[] {
  const combinations = [];

  for(var i = 0; i < a.length; i++) {
       for(var j = 0; j < b.length; j++) {
          combinations.push(`${a[i]}${b[j]}`)
       }
  }

  return combinations;
}

export const ALL_FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ALL_RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const ALL_AREAS: TArea[] = combineStringArrays(ALL_FILES, ALL_RANKS);

/**
 * Is user holding Ctrl (on PC) or Cmd (on Mac)
 */
export function holdingCtrlOrCmd(e: KeyboardEvent) {
  if (navigator.platform === 'MacIntel') {
    return e.metaKey;
  }

  return e.ctrlKey;
}

/**
 * Write some message to the user
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
 * Run callback on document ready
 * See https://stackoverflow.com/a/989970
 */
export function onDocumentReady(fn: () => void) : void {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

/**
 * Mark finishing of extension init
 * Can be used for styles tweaks
 */
export const EXTENTION_INITED_BODY_CLASSNAME = 'ccHelper-docBody--inited';
export const EXTENTION_INITED_HEAD_CLASSNAME = 'ccHelper-docHead--inited';
export function markExtentionInit() : void {
  document.head.classList.add(EXTENTION_INITED_HEAD_CLASSNAME);
  document.body.classList.add(EXTENTION_INITED_BODY_CLASSNAME);
}

/**
 * Text if passed element can take some text input
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
 */
export function isModifierPressed(e: KeyboardEvent) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
}

/**
 * Provide initial elements for the app
 */
export function createInitialElements() {
  const wrapper = domify(`
    <div class="ccHelper-wrapper">
      <input
        type="text"
        class="ccHelper-input"
        id="ccHelper-input"
        placeholder="${i18n('inputHint')}"
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
 * Translate square string to coords
 */
export function squareToCoords(square: TArea) : number[] {
  const ver = 'abcdefgh'.indexOf(square[0]) + 1;
  const hor = Number(square[1]);
  return [ver, hor];
}

/**
 * Translate coords string to square
 */
export function coordsToSquare(coords: string) : TArea {
  const numbers = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return numbers[Number(coords.slice(1, 2))] + coords.slice(3, 4);
}

export function getConfig() : IConfig {
  return {
    defaultLocale: 'en',
  };
}
