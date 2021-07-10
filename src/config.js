import { get, set } from '@/store';

const configKeyPrefix = '$';

export const LOCALE_KEY = `${configKeyPrefix}locale`;
export const LOCALE_DEFAULT = 'en';

export const PREFIX_KEY = `${configKeyPrefix}prefix`;
export const PREFIX_DEFAULT = 'dx';

const availableKeys = [LOCALE_KEY, PREFIX_KEY];

export function init(options) {
  for (const option in options) {
    const key = `${configKeyPrefix}${option}`;
    if (availableKeys.includes(key)) {
      set(key, options[option]);
    }
  }
}

export function getLocale() {
  return (get(LOCALE_KEY) || LOCALE_DEFAULT).toLowerCase();
}

export function getPrefix() {
  return (get(PREFIX_KEY) || PREFIX_DEFAULT).toLowerCase();
}
