import { Card } from '@finografic/design-system';
import { css } from '@styled-system/css';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function AdminSettingsPage(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'fg' })}>
        {t('admin.pages.settings.title', 'Settings')}
      </h1>
      <p className={css({ fontSize: 'sm', color: 'fg.muted', mt: '1', mb: '6' })}>
        {t('admin.pages.settings.subtitle', 'Application configuration')}
      </p>

      <Card>
        <div className={css({ p: '6', textAlign: 'center' })}>
          <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
            {t('admin.pages.settings.placeholder', 'Settings coming soon.')}
          </p>
        </div>
      </Card>
    </div>
  );
}
