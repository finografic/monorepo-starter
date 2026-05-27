import { Badge, Card } from '@finografic/design-system';
import { css } from '@styled-system/css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    key: 'auth',
    icon: '🔐',
    titleKey: 'app.features.auth.title',
    titleDefault: 'Auth.js + JWT',
    descKey: 'app.features.auth.desc',
    descDefault:
      'Credentials provider with JWT strategy, role-based access control, and secure cookie sessions.',
  },
  {
    key: 'i18n',
    icon: '🌍',
    titleKey: 'app.features.i18n.title',
    titleDefault: 'i18n — DB-backed',
    descKey: 'app.features.i18n.desc',
    descDefault: 'Server-side translation tables with en-GB and es-ES, served via i18next HTTP backend.',
  },
  {
    key: 'design',
    icon: '🎨',
    titleKey: 'app.features.design.title',
    titleDefault: 'Design System',
    descKey: 'app.features.design.desc',
    descDefault:
      '@finografic/design-system with Panda CSS — tokens, recipes, and 20+ production-ready components.',
  },
  {
    key: 'stack',
    icon: '⚡',
    titleKey: 'app.features.stack.title',
    titleDefault: 'Modern Stack',
    descKey: 'app.features.stack.desc',
    descDefault: 'Hono + Drizzle ORM on the server. Vite 7 + React 19 + react-router-dom on the client.',
  },
];

const ctaLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '4',
  py: '2',
  borderRadius: 'md',
  fontSize: 'sm',
  fontWeight: 'medium',
  textDecoration: 'none',
  transition: 'opacity 0.15s ease',
  _hover: { opacity: 0.9 },
});

export function LandingPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { isAuthenticated, role } = useAuth();

  return (
    <div className={css({ maxW: '5xl', mx: 'auto', py: '12', px: '4' })}>
      {/* Hero */}
      <section className={css({ textAlign: 'center', mb: '16' })}>
        <Badge palette="primary" className={css({ mb: '4' })}>
          {t('app.badge', 'Open-source starter')}
        </Badge>

        <h1 className={css({ fontSize: '4xl', fontWeight: 'bold', color: 'fg.default' })}>
          {t('app.title', 'monorepo-starter')}
        </h1>

        <p className={css({ fontSize: 'lg', color: 'fg.muted', mt: '4', maxW: '2xl', mx: 'auto' })}>
          {t('app.subtitle', 'A full-stack monorepo with auth, i18n, and a design system — ready to fork.')}
        </p>

        <div
          className={css({
            mt: '8',
            display: 'flex',
            gap: '3',
            justifyContent: 'center',
            flexWrap: 'wrap',
          })}
        >
          {isAuthenticated && role === 'admin' ? (
            <Link to="/admin" className={ctaLink + ' ' + css({ bg: 'colorPalette.default', color: 'white' })}>
              {t('ui.nav.adminPanel', 'Admin Panel')}
            </Link>
          ) : isAuthenticated ? (
            <Link
              to="/dashboard"
              className={ctaLink + ' ' + css({ bg: 'colorPalette.default', color: 'white' })}
            >
              {t('ui.nav.dashboard', 'Go to Dashboard')}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={ctaLink + ' ' + css({ bg: 'colorPalette.default', color: 'white' })}
              >
                {t('ui.buttons.signIn', 'Sign In')}
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={
                  ctaLink +
                  ' ' +
                  css({
                    border: '1px solid',
                    borderColor: 'border.default',
                    color: 'fg.default',
                    bg: 'bg.surface',
                  })
                }
              >
                {t('ui.buttons.viewSource', 'View on GitHub')}
              </a>
            </>
          )}
        </div>
      </section>

      {/* Feature grid */}
      <section>
        <h2 className={css({ textAlign: 'center', fontSize: '2xl', fontWeight: 'semibold', mb: '6' })}>
          {t('app.features.heading', "What's included")}
        </h2>

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', sm: '1fr 1fr' },
            gap: '4',
          })}
        >
          {FEATURES.map((f) => (
            <Card key={f.key}>
              <div className={css({ p: '5' })}>
                <div className={css({ fontSize: '2xl', mb: '2' })}>{f.icon}</div>
                <p className={css({ fontSize: 'md', fontWeight: 'semibold' })}>
                  {t(f.titleKey, f.titleDefault)}
                </p>
                <p className={css({ fontSize: 'sm', color: 'fg.muted', mt: '1' })}>
                  {t(f.descKey, f.descDefault)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
