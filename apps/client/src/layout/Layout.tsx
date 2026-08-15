import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import finograficLogoUrl from '../assets/finografic-logo.png';
import { LanguageSwitcher } from '../components/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return [
    'text-sm font-medium no-underline transition-colors hover:text-foreground',
    isActive ? 'text-brand-cyan' : 'text-muted-foreground',
  ].join(' ');
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
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
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 flex min-h-14 flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:flex-nowrap sm:px-6">
        <div className="flex min-w-0 items-center gap-4 md:gap-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-sm font-bold text-brand-wordmark no-underline"
          >
            <img src={finograficLogoUrl} alt="" className="size-7" />
            <span>monorepo-starter</span>
          </Link>
          <nav className="flex min-w-0 items-center gap-4 md:gap-8">
            <NavLink to="/" end className={navLinkClass}>
              {t('ui.nav.home', 'Home')}
            </NavLink>
            {isAuthenticated ? (
              <NavLink to="/dashboard" className={navLinkClass}>
                {t('ui.nav.dashboard', 'Dashboard')}
              </NavLink>
            ) : null}
            {role === 'admin' ? (
              <NavLink to="/admin" className={navLinkClass}>
                {t('ui.nav.adminPanel', 'Admin')}
              </NavLink>
            ) : null}
          </nav>
        </div>

        <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2 sm:flex-nowrap sm:gap-4">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <div className="flex min-w-0 items-center gap-2">
              <Badge variant={role === 'admin' ? 'destructive' : 'default'}>{role}</Badge>
              <Avatar size="sm">
                <AvatarFallback>{initials(user?.name ?? 'User') || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={() => void handleSignOut()}>
                {t('ui.buttons.signOut', 'Sign out')}
              </Button>
            </div>
          ) : (
            <Button
              asChild
              size="sm"
              className={cn('px-4', 'bg-brand-cyan text-white hover:bg-brand-cyan-hover')}
            >
              <Link to="/login" className="whitespace-nowrap">
                {t('ui.buttons.signIn', 'Sign in')}
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
