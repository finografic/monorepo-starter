import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Col, Row } from '@workspace/ui/components/grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import finograficLogoUrl from '../assets/finografic-logo.png';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    key: 'auth',
    label: 'Auth',
    titleKey: 'app.features.auth.title',
    titleDefault: 'Auth.js + JWT',
    descKey: 'app.features.auth.desc',
    descDefault:
      'Credentials provider with JWT strategy, role-based access control, and secure cookie sessions.',
  },
  {
    key: 'i18n',
    label: 'i18n',
    titleKey: 'app.features.i18n.title',
    titleDefault: 'DB-backed i18n',
    descKey: 'app.features.i18n.desc',
    descDefault: 'Server-side translation tables with en-GB and es-ES, served via i18next HTTP backend.',
  },
  {
    key: 'design',
    label: 'UI',
    titleKey: 'app.features.design.title',
    titleDefault: 'shadcn + Tailwind 4',
    descKey: 'app.features.design.desc',
    descDefault: 'shadcn components with Tailwind 4 tokens, recipes, and owned source components.',
  },
  {
    key: 'stack',
    label: 'Stack',
    titleKey: 'app.features.stack.title',
    titleDefault: 'Modern full-stack app',
    descKey: 'app.features.stack.desc',
    descDefault: 'Hono + Drizzle ORM on the server. Vite 8 + React 19 + React Router v7 on the client.',
  },
];

const CAPABILITIES = ['Vite 8', 'React 19', 'Hono', 'Drizzle ORM', 'Auth.js', 'Tailwind 4'];

export function LandingPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="bg-background">
      <section className="border-b bg-[linear-gradient(180deg,color-mix(in_oklch,var(--brand-green-soft)_45%,white),var(--background)_72%)]">
        <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 lg:py-18">
          <div className="max-w-3xl">
            <Badge className="mb-5 bg-brand-green-soft text-brand-green-strong hover:bg-brand-green-soft">
              {t('app.badge', 'Open-source starter')}
            </Badge>

            <div className="mb-5 flex items-center gap-3">
              <img src={finograficLogoUrl} alt="" className="size-12 shrink-0" />
              <p className="text-sm font-semibold text-brand-wordmark">Finografic</p>
            </div>

            <h1 className="max-w-3xl text-5xl leading-[0.98] font-semibold text-balance text-foreground sm:text-6xl lg:text-7xl">
              {t('app.title', 'Monorepo Starter')}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {t(
                'app.subtitle',
                'A production-shaped TypeScript monorepo with auth, i18n, data access, admin surfaces, and a reusable UI package ready to adapt.',
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {CAPABILITIES.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-brand-cyan/20 bg-background/80 px-3 py-1 text-sm font-medium text-brand-wordmark shadow-sm"
                >
                  {capability}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {isAuthenticated && role === 'admin' ? (
                <Button asChild className="bg-brand-cyan text-white hover:bg-brand-cyan-hover">
                  <Link to="/admin">{t('ui.nav.adminPanel', 'Admin Panel')}</Link>
                </Button>
              ) : isAuthenticated ? (
                <Button asChild className="bg-brand-cyan text-white hover:bg-brand-cyan-hover">
                  <Link to="/dashboard">{t('ui.nav.dashboard', 'Go to Dashboard')}</Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="bg-brand-cyan text-white hover:bg-brand-cyan-hover">
                    <Link to="/login">{t('ui.buttons.signIn', 'Sign In')}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href="https://github.com/finografic/monorepo-starter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('ui.buttons.viewSource', 'View on GitHub')}
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-18">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold text-brand-cyan">
            {t('app.features.eyebrow', 'Included foundation')}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            {t('app.features.heading', "What's included")}
          </h2>
        </div>

        <Row align="stretch" gutterWidth={16}>
          {FEATURES.map((feature) => (
            <Col key={feature.key} xs={12} sm={6}>
              <Card className="h-full border-border/80 shadow-sm">
                <CardContent className="p-5">
                  <span className="inline-flex h-8 items-center rounded-full bg-brand-green-soft px-3 text-xs font-semibold text-brand-green-strong">
                    {feature.label}
                  </span>
                  <p className="mt-4 text-lg font-semibold text-foreground">
                    {t(feature.titleKey, feature.titleDefault)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t(feature.descKey, feature.descDefault)}
                  </p>
                </CardContent>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
}
