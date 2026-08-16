import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Col, Row } from '@workspace/ui/components/grid';
import { GlobeIcon, GridIcon, ShieldCheckIcon, ZapIcon } from '@finografic/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    key: 'auth',
    Icon: ShieldCheckIcon,
    titleKey: 'app.features.auth.title',
    titleDefault: 'Auth.js + JWT',
    descKey: 'app.features.auth.desc',
    descDefault:
      'Credentials provider with JWT strategy, role-based access control, and secure cookie sessions.',
  },
  {
    key: 'i18n',
    Icon: GlobeIcon,
    titleKey: 'app.features.i18n.title',
    titleDefault: 'DB-backed i18n',
    descKey: 'app.features.i18n.desc',
    descDefault: 'Server-side translation tables with en-GB and es-ES, served via i18next HTTP backend.',
  },
  {
    key: 'design',
    Icon: GridIcon,
    titleKey: 'app.features.design.title',
    titleDefault: 'shadcn + Tailwind 4',
    descKey: 'app.features.design.desc',
    descDefault: 'shadcn components with Tailwind 4 tokens, recipes, and owned source components.',
  },
  {
    key: 'stack',
    Icon: ZapIcon,
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
      <section className="bg-background">
        <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-6xl flex-col justify-start px-4 py-10 sm:px-6 lg:py-12">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-brand-green-soft text-brand-green-strong hover:bg-brand-green-soft">
              {t('app.badge', 'Open-source starter')}
            </Badge>

            <h1 className="max-w-3xl text-5xl leading-[0.98] font-semibold text-balance text-foreground sm:text-6xl lg:text-7xl">
              {t('app.title', 'Monorepo Starter')}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {t(
                'app.subtitle',
                'A production-shaped TypeScript monorepo with auth, i18n, data access, admin surfaces, and a reusable UI package ready to adapt.',
              )}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {CAPABILITIES.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-brand-cyan/20 bg-background/80 px-3 py-1 text-sm font-medium text-brand-wordmark shadow-sm"
                >
                  {capability}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
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

          <section className="mt-10 w-full lg:mt-12">
            <div className="mb-5 max-w-2xl">
              <p className="text-sm font-semibold text-brand-cyan">
                {t('app.features.eyebrow', 'Included foundation')}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">
                {t('app.features.heading', "What's included")}
              </h2>
            </div>

            <Row align="stretch" gutterWidth={16}>
              {FEATURES.map((feature) => (
                <Col key={feature.key} xs={12} md={6} className="mb-4">
                  <Card className="h-full border-2">
                    <CardContent className="flex items-start gap-4 px-5 py-3 sm:items-center sm:py-1">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-green-soft"
                        aria-hidden="true"
                      >
                        <feature.Icon className="size-8 text-brand-green-strong" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="font-heading font-semibold">
                          {t(feature.titleKey, feature.titleDefault)}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t(feature.descKey, feature.descDefault)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        </div>
      </section>
    </div>
  );
}
