import { Route, Routes } from 'react-router-dom';
import type React from 'react';

import { ProtectedRoute } from './components/ProtectedRoute';
import { StyleSmokeTest } from './components/StyleSmokeTest';
import { AdminLayout } from './layout/AdminLayout';
import { Layout } from './layout/Layout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminTranslationsPage } from './pages/admin/AdminTranslationsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

export function App(): React.JSX.Element {
  return (
    <>
      <StyleSmokeTest />
      <Routes>
        {/* Public / authenticated layout */}
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin layout — requires admin role */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="translations" element={<AdminTranslationsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}
