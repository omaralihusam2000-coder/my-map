import { translations, TranslationKey } from './translations';
import { Language } from '../types';

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang]?.[key] ?? translations['ar'][key] ?? key;
}

export { type TranslationKey };
