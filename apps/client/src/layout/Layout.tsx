import { Link, Outlet } from 'react-router-dom';
import type React from 'react';

import { LanguageSwitcher } from '../components/LanguageSwitcher/LanguageSwitcher';

export function Layout(): React.JSX.Element {
  return (
    <div>
      <nav
        style={{
          padding: '1rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <LanguageSwitcher />
      </nav>
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
