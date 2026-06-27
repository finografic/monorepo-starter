export const QUERY_KEYS = {
  translations: {
    all: ['translations'] as const,
    domain: (domain: TranslationDomain) => [...QUERY_KEYS.translations.all, domain] as const,
  },
};

export type TranslationDomain = 'ui' | 'app' | 'admin';

export { useTranslationDomains } from './useTranslationDomains';
export { useUpdateTranslation } from './useUpdateTranslation';
export type { TranslationRow } from './useTranslationDomains';
