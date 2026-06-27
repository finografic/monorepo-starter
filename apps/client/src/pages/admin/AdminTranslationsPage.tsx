import { Button, Spinner, TabsDS } from '@finografic/design-system';
import { css } from '@styled-system/css';
import { useTranslationDomains, useUpdateTranslation } from 'queries/translations';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TranslationDomain, TranslationRow } from 'queries/translations';

const LANGUAGES = ['en-GB', 'es-ES'];

function TranslationDomainTable({ domain }: { domain: TranslationDomain }) {
  const rowsQuery = useTranslationDomains(domain);
  const updateTranslation = useUpdateTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const startEdit = (row: TranslationRow) => {
    setEditingId(row.id);
    setDraft(row.translations ?? {});
  };

  const saveEdit = async (id: string) => {
    await updateTranslation.mutateAsync({ domain, id, translations: draft });
    setEditingId(null);
  };

  if (rowsQuery.isLoading) {
    return (
      <div className={css({ display: 'flex', justifyContent: 'center', py: '8' })}>
        <Spinner />
      </div>
    );
  }

  if (rowsQuery.error) {
    return (
      <p className={css({ fontSize: 'sm', color: 'fg.error' })}>
        {rowsQuery.error instanceof Error ? rowsQuery.error.message : 'Failed to load translations'}
      </p>
    );
  }

  return (
    <div className={css({ display: 'flex', flexDir: 'column', gap: '2' })}>
      {(rowsQuery.data ?? []).map((row) => (
        <div
          key={row.id}
          className={css({
            border: '1px solid',
            borderColor: 'border.subtle',
            borderRadius: 'md',
            p: '3',
            bg: 'bg.surface',
          })}
        >
          <div
            className={css({
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '2',
            })}
          >
            <code className={css({ fontSize: 'xs', color: 'fg.muted', flex: 1, wordBreak: 'break-all' })}>
              {row.key}
            </code>
            {editingId !== row.id && (
              <Button variant="ghost" size="xs" onClick={() => startEdit(row)}>
                Edit
              </Button>
            )}
          </div>

          {editingId === row.id ? (
            <div className={css({ mt: '2', display: 'flex', flexDir: 'column', gap: '2' })}>
              {LANGUAGES.map((lng) => (
                <div key={lng} className={css({ display: 'flex', gap: '2', alignItems: 'center' })}>
                  <span
                    className={css({
                      fontSize: 'xs',
                      fontWeight: 'medium',
                      w: '12',
                      flexShrink: 0,
                      color: 'fg.muted',
                    })}
                  >
                    {lng}
                  </span>
                  <input
                    type="text"
                    value={draft[lng] ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, [lng]: e.target.value }))}
                    className={css({
                      flex: 1,
                      fontSize: 'xs',
                      px: '2',
                      py: '1',
                      borderRadius: 'sm',
                      border: '1px solid',
                      borderColor: 'border',
                      bg: 'bg',
                      outline: 'none',
                      _focus: { borderColor: 'accent' },
                    })}
                  />
                </div>
              ))}
              <div className={css({ display: 'flex', gap: '2', mt: '1' })}>
                <Button
                  size="xs"
                  palette="primary"
                  loading={updateTranslation.isPending && updateTranslation.variables.id === row.id}
                  onClick={() => void saveEdit(row.id)}
                >
                  Save
                </Button>
                <Button size="xs" variant="ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={css({ mt: '1', display: 'flex', flexDir: 'column', gap: '0.5' })}>
              {LANGUAGES.map((lng) => (
                <p key={lng} className={css({ fontSize: 'xs' })}>
                  <span className={css({ color: 'fg.muted', mr: '1' })}>{lng}:</span>
                  {row.translations?.[lng] ? (
                    row.translations[lng]
                  ) : (
                    <em className={css({ color: 'fg.subtle' })}>empty</em>
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const UI_TABLE = <TranslationDomainTable domain="ui" />;
const APP_TABLE = <TranslationDomainTable domain="app" />;
const ADMIN_TABLE = <TranslationDomainTable domain="admin" />;

export function AdminTranslationsPage(): React.JSX.Element {
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      { value: 'ui', label: t('admin.translations.tabs.ui', 'UI'), content: UI_TABLE },
      { value: 'app', label: t('admin.translations.tabs.app', 'App'), content: APP_TABLE },
      { value: 'admin', label: t('admin.translations.tabs.admin', 'Admin'), content: ADMIN_TABLE },
    ],
    [t],
  );

  return (
    <div>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'fg' })}>
        {t('admin.pages.translations.title', 'Translations')}
      </h1>
      <p className={css({ fontSize: 'sm', color: 'fg.muted', mt: '1', mb: '6' })}>
        {t('admin.pages.translations.subtitle', 'Manage UI, app, and admin copy')}
      </p>

      <TabsDS defaultValue="ui" tabs={tabs} />
    </div>
  );
}
