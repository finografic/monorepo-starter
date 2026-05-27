import { AvatarDS, Badge, Button } from '@finografic/design-system';
import { css } from '@styled-system/css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { LanguageSwitcher } from '../components/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

function navLinkClass({ isActive }: { isActive: boolean }) {
  return css({
    fontSize: 'sm',
    fontWeight: 'medium',
    textDecoration: 'none',
    color: isActive ? 'colorPalette.default' : 'fg.muted',
    _hover: { color: 'fg.default' },
  });
}

export function Layout(): React.JSX.Element {
  const { t } = useTranslation();
  const { user, isAuthenticated, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className={css({ minH: '100dvh', display: 'flex', flexDir: 'column', bg: 'bg.canvas' })}>
      <header
        className={css({
          borderBottom: '1px solid',
          borderColor: 'border.subtle',
          bg: 'bg.surface',
          px: '6',
          h: '14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        })}
      >
        <div className={css({ display: 'flex', alignItems: 'center', gap: '6' })}>
          <Link
            to="/"
            className={css({
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: 'sm',
              color: 'fg.default',
            })}
          >
            monorepo-starter
          </Link>
          <nav className={css({ display: 'flex', gap: '4' })}>
            <NavLink to="/" end className={navLinkClass}>
              {t('ui.nav.home', 'Home')}
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass}>
                {t('ui.nav.dashboard', 'Dashboard')}
              </NavLink>
            )}
            {role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>
                {t('ui.nav.adminPanel', 'Admin')}
              </NavLink>
            )}
          </nav>
        </div>

        <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <Badge palette={role === 'admin' ? 'danger' : 'primary'} size="sm">
                {role}
              </Badge>
              <AvatarDS name={user?.name ?? 'U'} size="sm" />
              <Button variant="ghost" size="sm" onClick={() => void handleSignOut()}>
                {t('ui.buttons.signOut', 'Sign out')}
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className={css({
                px: '3',
                py: '1.5',
                fontSize: 'sm',
                fontWeight: 'medium',
                borderRadius: 'md',
                bg: 'colorPalette.default',
                color: 'white',
                textDecoration: 'none',
                _hover: { opacity: 0.9 },
              })}
            >
              {t('ui.buttons.signIn', 'Sign in')}
            </Link>
          )}
        </div>
      </header>

      <main className={css({ flex: 1 })}>
        <Outlet />
      </main>
    </div>
  );
}
