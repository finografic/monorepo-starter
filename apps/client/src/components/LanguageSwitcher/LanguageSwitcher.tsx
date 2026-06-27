import { css } from '@styled-system/css';
import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '../../i18n/i18n.constants';
import type React from 'react';

import { SUPPORTED_LANGUAGES } from '../../i18n/i18n.constants';

const LABELS: Record<SupportedLanguage, string> = {
  'en-GB': 'EN',
  'es-ES': 'ES',
};

export function LanguageSwitcher(): React.JSX.Element {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;

  const handleChange = (lng: SupportedLanguage) => {
    void i18n.changeLanguage(lng);
  };

  return (
    <div className={css({ display: 'flex', gap: '2', alignItems: 'center' })}>
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          aria-label={`Switch to ${lng}`}
          aria-pressed={current === lng}
          onClick={() => handleChange(lng)}
          className={css({
            px: '2',
            py: '1',
            fontSize: 'xs',
            fontWeight: 'semibold',
            letterSpacing: 'wide',
            borderRadius: 'sm',
            border: '1px solid',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            borderColor: current === lng ? 'accent' : 'transparent',
            bg: current === lng ? 'accent' : 'transparent',
            color: current === lng ? 'white' : 'inherit',
            _hover: {
              borderColor: 'accent',
              opacity: current === lng ? 1 : 0.7,
            },
          })}
        >
          {LABELS[lng]}
        </button>
      ))}
    </div>
  );
}
