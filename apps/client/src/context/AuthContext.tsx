import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthSession } from '../lib/auth-client';

import { authClient } from '../lib/auth-client';

type Role = 'public' | 'user' | 'admin';

export type AuthUser = AuthSession['user'];

interface AuthState {
  user: AuthUser | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const session = await authClient.getSession();
      setUser(session?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void refreshSession();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [refreshSession]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) return { error: result.error.message };
    if (result.data?.user) setUser(result.data.user);
    return {};
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string): Promise<{ error?: string }> => {
      const result = await authClient.signUp.email({ email, password, name });
      if (result.error) return { error: result.error.message };
      return {};
    },
    [],
  );

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      role: user?.role ?? 'public',
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshSession,
    }),
    [user, isLoading, signIn, signUp, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
