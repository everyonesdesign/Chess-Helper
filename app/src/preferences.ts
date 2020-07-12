import { detectLocale } from './i18n';
import domify from 'domify';
import {
  IPreferences,
} from './types';

export const DEFAULT_PREFERENCES: IPreferences = {
  locale: detectLocale(),
  speechEnabled: false,
};

function restorePreferences() {
  return DEFAULT_PREFERENCES;
}

export const PREFERENCES = restorePreferences();

const modalRoot = domify(`
  <div class="ccHelper-preferencesModal">
    <div class="ccHelper-preferencesModalOverlay"></div>
    <div
      class="ccHelper-preferencesModalBody"
      role="modal"
      tabindex="-1"
    >
      <h2 class="ccHelper-preferencesModalTitle">
        @TR: Chess.com Keyboard preferences
      </h2>

      <button
        class="ccHelper-preferencesModalClose"
        aria-label="@TR: Close modal"
      >✕</button>

      <div class="ccHelper-preferencesSection">
        <label
            class="ccHelper-preferencesLabel"
            for="ccHelper-preferencesLanguageSelect"
            id="ccHelper-preferencesLanguageLabel"
        >
          @TR: Chess.com Keyboard language
        </label>
        <select
            for="ccHelper-preferencesLanguageSelect"
            id="ccHelper-preferencesLanguageSelect"
            name="ccHelper-preferencesLanguageSelect"
            aria-labelledby="ccHelper-preferencesLanguageLabel"
        >
          <option value="auto" ${ PREFERENCES.locale === 'auto' ? 'selected': '' }>
            @TR: Auto
          </option>
          <option value="en" ${ PREFERENCES.locale === 'en' ? 'selected': '' }>
            @TR: English
          </option>
          <option value="ru" ${ PREFERENCES.locale === 'ru' ? 'selected': '' }>
            @TR: Russian
          </option>
        </select>
      </label>

      <div class="ccHelper-preferencesSection">
        <div class="ccHelper-preferencesLabel">
          @TR: Speech
        </div>
        <input
          type="checkbox"
          ${ PREFERENCES.speechEnabled ? 'checked' : '' }
          role="switch"
          name="ccHelper-preferencesEnableSpeech"
          id="ccHelper-preferencesEnableSpeech"
          aria-labelledby="ccHelper-preferencesEnableSpeechNote"
        >
        <label
            class="ccHelper-preferencesNote"
            for="ccHelper-preferencesEnableSpeech"
            id="ccHelper-preferencesEnableSpeechNote"
        >
          @TR: Each move will be announced with voice
        </label>
      </div>
    </div>
  </div>
`);

const elements = {
  root: <HTMLElement>modalRoot,
  body: <HTMLElement>modalRoot.querySelector('.ccHelper-preferencesModalBody'),
  overlay: <HTMLElement>modalRoot.querySelector('.ccHelper-preferencesModalOverlay'),
  close: <HTMLButtonElement>modalRoot.querySelector('.ccHelper-preferencesModalClose'),
  languageSelect: <HTMLSelectElement>modalRoot.querySelector('#ccHelper-preferencesLanguageSelect'),
  enableSpeechSwitch: <HTMLInputElement>modalRoot.querySelector('#ccHelper-preferencesEnableSpeech'),
};

elements.close.addEventListener('click', hidePreferences);

export function updatePreferences(patch: Partial<IPreferences>) {
    Object.assign(PREFERENCES, patch);
}

export function showPreferences() {
    document.body.appendChild(elements.root);
    elements.body.focus();
}

export function hidePreferences() {
    document.body.removeChild(elements.root);
    const button = document.querySelector('.ccHelper-preferencesButton');
    if (button) {
        (<HTMLButtonElement>button).focus();
    }
}
