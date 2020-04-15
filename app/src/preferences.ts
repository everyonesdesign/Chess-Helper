import { detectLocale } from './i18n';
import domify from 'domify';
import {
  IPreferences,
} from './types';

export const DEFAULT_PREFERENCES: IPreferences = {
  locale: detectLocale(),
  movesToSpeech: {
    enabled: false,
  }
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
      <div class="ccHelper-preferencesModalTitle">
        @TR: Chess.com Keyboard preferences
      </div>

      <button
        class="ccHelper-preferencesModalClose"
        aria-label="@TR: Close modal"
      >✕</button>

      <div class="ccHelper-preferencesSection">
        <label for="ccHelper-preferencesLanguageSelect">
          @TR: Chess.com Keyboard language
        </label>
        <select id="ccHelper-preferencesLanguageSelect">
          <option value="auto" ${ PREFERENCES.locale === 'auto' ? 'selected': '' }>
            @TR: Auto
          </option>
          <option value="en" ${ PREFERENCES.locale === 'en' ? 'selected': '' }>
            @TR: Englisn
          </option>
          <option value="ru" ${ PREFERENCES.locale === 'ru' ? 'selected': '' }>
            @TR: Russian
          </option>
        </select>
      </label>

      <div class="ccHelper-preferencesSection">
        <label for="ccHelper-preferencesEnableSpeech">
          @TR: Enable speech
        </label>
        <input
          type="checkbox"
          ${ PREFERENCES.movesToSpeech.enabled ? 'checked' : '' }
          role="switch"
          id="ccHelper-preferencesEnableSpeech"
          aria-describedby=""
        >
        <div class="ccHelper-preferencesNote">
          @TR: Each move will be announced with voice
        </div>
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

export function updatePreferences() {}

export function showPreferences() {}

export function hidePreferences() {}
