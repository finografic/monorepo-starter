export const I18N_NAMESPACE = 'translations' as const;
export const I18N_TRANSLATION_DOMAINS = ['ui', 'app', 'admin'] as const;

export const DEFAULT_LANGUAGE = 'en-GB' as const;
export const SUPPORTED_LANGUAGES = ['en-GB', 'es-ES'] as const;

export const LOCALE_MAPPING: Record<string, SupportedLanguage> = {
  en: 'en-GB',
  es: 'es-ES',
} as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type I18nDomain = (typeof I18N_TRANSLATION_DOMAINS)[number];
