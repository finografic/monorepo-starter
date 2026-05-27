import { Button, Card } from '@finografic/design-system';
import { css } from '@styled-system/css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

type Mode = 'signin' | 'signup';

export function LoginPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return <></>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        navigate('/');
      } else {
        const result = await signUp(email, password, name);
        if (result.error) {
          setError(result.error);
          return;
        }
        const signInResult = await signIn(email, password);
        if (signInResult.error) {
          setError('Account created — please sign in.');
          setMode('signin');
          return;
        }
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = css({
    w: 'full',
    px: '3',
    py: '2',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'border.default',
    bg: 'bg.surface',
    fontSize: 'sm',
    color: 'fg.default',
    outline: 'none',
    _focus: {
      borderColor: 'colorPalette.default',
      ring: '2px',
      ringColor: 'colorPalette.subtle',
    },
    _placeholder: { color: 'fg.subtle' },
  });

  const labelClass = css({
    display: 'block',
    fontSize: 'sm',
    fontWeight: 'medium',
    color: 'fg.muted',
    mb: '1',
  });

  return (
    <div
      className={css({
        minH: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'bg.canvas',
        p: '4',
      })}
    >
      <div className={css({ w: 'full', maxW: 'sm' })}>
        <div className={css({ textAlign: 'center', mb: '8' })}>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'fg.default' })}>
            {t('app.title')}
          </h1>
          <p className={css({ fontSize: 'sm', color: 'fg.muted', mt: '1' })}>
            {mode === 'signin'
              ? t('ui.common.signIn', 'Sign in to your account')
              : t('ui.common.createAccount', 'Create a new account')}
          </p>
        </div>

        <Card>
          <div className={css({ p: '6' })}>
            <form
              onSubmit={(e) => void handleSubmit(e)}
              className={css({ display: 'flex', flexDir: 'column', gap: '4' })}
            >
              {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className={labelClass}>
                    {t('ui.form.name', 'Name')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('ui.form.namePlaceholder', 'Your full name')}
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelClass}>
                  {t('ui.form.email', 'Email')}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete={mode === 'signin' ? 'email' : 'new-email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  {t('ui.form.password', 'Password')}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              {error && <p className={css({ fontSize: 'sm', color: 'error.default' })}>{error}</p>}

              <Button type="submit" palette="primary" fullWidth loading={isLoading}>
                {mode === 'signin'
                  ? t('ui.buttons.signIn', 'Sign In')
                  : t('ui.buttons.signUp', 'Create Account')}
              </Button>
            </form>

            <div className={css({ mt: '4', textAlign: 'center', fontSize: 'sm', color: 'fg.muted' })}>
              {mode === 'signin'
                ? t('ui.common.noAccount', "Don't have an account?")
                : t('ui.common.haveAccount', 'Already have an account?')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                }}
                className={css({
                  color: 'colorPalette.default',
                  fontWeight: 'medium',
                  cursor: 'pointer',
                  bg: 'transparent',
                  border: 'none',
                  p: '0',
                  fontSize: 'sm',
                  _hover: { textDecoration: 'underline' },
                })}
              >
                {mode === 'signin' ? t('ui.buttons.signUp', 'Sign up') : t('ui.buttons.signIn', 'Sign in')}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
