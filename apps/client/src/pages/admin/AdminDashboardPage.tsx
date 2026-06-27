import { Card } from '@finografic/design-system';
import { css } from '@styled-system/css';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../context/AuthContext';

export function AdminDashboardPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'fg' })}>
        {t('admin.pages.dashboard.title', 'Dashboard')}
      </h1>
      <p className={css({ fontSize: 'sm', color: 'fg.muted', mt: '1', mb: '6' })}>
        {t('admin.pages.dashboard.subtitle', 'Welcome back,')} {user?.name}
      </p>

      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: '1fr 1fr 1fr' },
          gap: '4',
        })}
      >
        <Card>
          <div className={css({ p: '5' })}>
            <p
              className={css({
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'fg.subtle',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
              })}
            >
              {t('admin.stats.users', 'Users')}
            </p>
            <p className={css({ fontSize: '3xl', fontWeight: 'bold', mt: '1' })}>—</p>
            <p className={css({ fontSize: 'xs', color: 'fg.muted', mt: '1' })}>
              {t('admin.stats.registered', 'Registered accounts')}
            </p>
          </div>
        </Card>

        <Card>
          <div className={css({ p: '5' })}>
            <p
              className={css({
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'fg.subtle',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
              })}
            >
              {t('admin.stats.languages', 'Languages')}
            </p>
            <p className={css({ fontSize: '3xl', fontWeight: 'bold', mt: '1' })}>2</p>
            <p className={css({ fontSize: 'xs', color: 'fg.muted', mt: '1' })}>en-GB · es-ES</p>
          </div>
        </Card>

        <Card>
          <div className={css({ p: '5' })}>
            <p
              className={css({
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'fg.subtle',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
              })}
            >
              {t('admin.stats.translations', 'Translations')}
            </p>
            <p className={css({ fontSize: '3xl', fontWeight: 'bold', mt: '1' })}>53</p>
            <p className={css({ fontSize: 'xs', color: 'fg.muted', mt: '1' })}>
              {t('admin.stats.translationKeys', 'Total keys (UI + App + Admin)')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
