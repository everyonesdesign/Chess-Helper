import {
  getConfig,
} from './utils';
import {
  TLocaleSet,
  TTranslationId,
} from './types';

import en from '../_locales/en';

export const LOCALES = { en };

export function i18n(
  messageId: TTranslationId,
  placeholders?: Record<string, string>,
  locale: string = getLocale(),
) : string {
  const localeSet = <any>(<any>LOCALES)[locale];
  const message = <string>localeSet[messageId];

  return message.replace(/\$([\w\d]+)/g, function ($0, $1) {
    return placeholders![$1];
  });
}

export function getLocale() : string {
  const userLocale = window.navigator.languages
    .map((locale) => {
      return locale.slice(0, 2);
    })
    .find((locale) => (<any>LOCALES)[locale]);

  if (userLocale) {
    return userLocale;
  }

  const config = getConfig();
  return config.defaultLocale;
}
