import {
  getConfig,
} from './utils';
import {
  TLocale,
  TLocaleSet,
  TTranslationId,
} from './types';

import en from '../_locales/en';
import ru from '../_locales/ru';
export const LOCALES: Record<TLocale, TLocaleSet> = {
  en,
  ru,
};

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

export function getShortLocale(input: string) : TLocale {
  return <TLocale>input.slice(0, 2)
}

export function getLocale() : TLocale {
  return detectLocale();
}

export function detectLocale() : TLocale {
  const chessComLocale = document.documentElement.getAttribute('lang');
  if (chessComLocale) {
    const shortLocale = getShortLocale(chessComLocale);
    const matchedLocaleSet = (<any>LOCALES)[getShortLocale(shortLocale)];
    if (matchedLocaleSet) {
      return shortLocale;
    }
  }

  const userLocale = window.navigator.languages
    .map((browserLocale) => getShortLocale(browserLocale))
    .find((locale) => (<any>LOCALES)[locale]);

  if (userLocale) {
    return <TLocale>userLocale;
  }

  const config = getConfig();
  return <TLocale>config.defaultLocale;
}
