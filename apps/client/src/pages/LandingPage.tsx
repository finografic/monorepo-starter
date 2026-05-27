import { useTranslation } from 'react-i18next';
import type React from 'react';

export function LandingPage(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.subtitle')}</p>
      <p>{t('app.description')}</p>
    </div>
  );
}
