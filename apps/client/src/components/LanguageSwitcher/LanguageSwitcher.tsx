import { Button } from '@workspace/ui/components/button';
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
    <div className="flex items-center gap-1">
      {SUPPORTED_LANGUAGES.map((lng) => (
        <Button
          key={lng}
          type="button"
          size="xs"
          variant="outline"
          aria-label={`Switch to ${lng}`}
          aria-pressed={current === lng}
          onClick={() => handleChange(lng)}
          className={
            current === lng
              ? 'border-brand-cyan px-2 text-xs tracking-wide text-brand-cyan hover:bg-brand-cyan/10'
              : 'px-2 text-xs tracking-wide'
          }
        >
          {LABELS[lng]}
        </Button>
      ))}
    </div>
  );
}
