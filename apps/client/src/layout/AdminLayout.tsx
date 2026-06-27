import { AvatarDS, Badge, Button } from '@finografic/design-system';
import { css } from '@styled-system/css';
import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users', end: false },
  { to: '/admin/translations', label: 'Translations', end: false },
  { to: '/admin/settings', label: 'Settings', end: false },
];

export function AdminLayout(): React.JSX.Element {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className={css({ display: 'flex', minH: '100dvh', bg: 'bg' })}>
      {/* Sidebar */}
      <aside
        className={css({
          w: '56',
          flexShrink: 0,
          display: 'flex',
          flexDir: 'column',
          borderRight: '1px solid',
          borderColor: 'border.subtle',
          bg: 'bg.surface',
        })}
      >
        <div
          className={css({
            px: '4',
            py: '5',
            borderBottom: '1px solid',
            borderColor: 'border.subtle',
          })}
        >
          <Link to="/" className={css({ textDecoration: 'none' })}>
            <span
              className={css({
                fontWeight: 'bold',
                fontSize: 'sm',
                color: 'accent',
              })}
            >
              monorepo-starter
            </span>
          </Link>
          <Badge palette="primary" className={css({ mt: '1', display: 'block', w: 'fit' })}>
            Admin
          </Badge>
        </div>

        <nav
          className={css({
            flex: 1,
            px: '2',
            py: '4',
            display: 'flex',
            flexDir: 'column',
            gap: '1',
          })}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                css({
                  display: 'block',
                  px: '3',
                  py: '2',
                  borderRadius: 'md',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  bg: isActive ? 'accent.subtle' : 'transparent',
                  color: isActive ? 'accent' : 'fg.muted',
                  _hover: { bg: 'bg.muted', color: 'fg' },
                })
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className={css({ flex: 1, display: 'flex', flexDir: 'column', minW: 0 })}>
        {/* Topbar */}
        <header
          className={css({
            h: '14',
            px: '6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '3',
            borderBottom: '1px solid',
            borderColor: 'border.subtle',
            bg: 'bg.surface',
          })}
        >
          <AvatarDS name={user?.name ?? 'User'} size="sm" />
          <span className={css({ fontSize: 'sm', color: 'fg.muted' })}>{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={() => void handleSignOut()}>
            Sign out
          </Button>
        </header>

        <main className={css({ flex: 1, p: '6', overflow: 'auto' })}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
