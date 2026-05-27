import { Badge, DataTable, Spinner } from '@finografic/design-system';
import type { DataTableColumn } from '@finografic/design-system';
import { css } from '@styled-system/css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'public' | 'user' | 'admin';
  emailVerified: boolean;
  createdAt: string | null;
}

const ROLE_PALETTE: Record<UserRow['role'], 'danger' | 'primary' | 'neutral'> = {
  admin: 'danger',
  user: 'primary',
  public: 'neutral',
};

const selectClass = css({
  fontSize: 'xs',
  px: '2',
  py: '1',
  borderRadius: 'sm',
  border: '1px solid',
  borderColor: 'border.default',
  bg: 'bg.surface',
  cursor: 'pointer',
});

interface RoleCellProps {
  user: UserRow;
  updatingId: string | null;
  onUpdateRole: (id: string, role: UserRow['role']) => void;
}

function RoleCell({ user: userRow, updatingId, onUpdateRole }: RoleCellProps) {
  return (
    <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
      <Badge palette={ROLE_PALETTE[userRow.role]}>{userRow.role}</Badge>
      <select
        value={userRow.role}
        disabled={updatingId === userRow.id}
        onChange={(e) => onUpdateRole(userRow.id, e.target.value as UserRow['role'])}
        className={selectClass}
      >
        <option value="public">public</option>
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
    </div>
  );
}

export function AdminUsersPage(): React.JSX.Element {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/users', { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as UserRow[];
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const updateRole = useCallback(async (id: string, role: UserRow['role']) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = (await res.json()) as UserRow;
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)));
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const columns = useMemo<Array<DataTableColumn<UserRow>>>(
    () => [
      {
        accessorKey: 'name',
        header: t('admin.users.columns.name', 'Name'),
      },
      {
        accessorKey: 'email',
        header: t('admin.users.columns.email', 'Email'),
      },
      {
        accessorKey: 'role',
        header: t('admin.users.columns.role', 'Role'),
        cell: ({ row }) => (
          <RoleCell
            user={row.original}
            updatingId={updatingId}
            onUpdateRole={(id, role) => void updateRole(id, role)}
          />
        ),
      },
      {
        accessorKey: 'emailVerified',
        header: t('admin.users.columns.verified', 'Verified'),
        cell: ({ getValue }) => (
          <Badge palette={getValue<boolean>() ? 'success' : 'neutral'}>
            {getValue<boolean>() ? 'yes' : 'no'}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('admin.users.columns.created', 'Created'),
        cell: ({ getValue }) => {
          const val = getValue<string | null>();
          if (!val) return '—';
          return new Date(val).toLocaleDateString('en-GB');
        },
      },
    ],
    [t, updatingId, updateRole],
  );

  return (
    <div>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'fg.default' })}>
        {t('admin.pages.users.title', 'Users')}
      </h1>
      <p className={css({ fontSize: 'sm', color: 'fg.muted', mt: '1', mb: '6' })}>
        {t('admin.pages.users.subtitle', 'Manage accounts and roles')}
      </p>

      {error && <p className={css({ fontSize: 'sm', color: 'error.default', mb: '4' })}>{error}</p>}

      {isLoading ? (
        <div className={css({ display: 'flex', justifyContent: 'center', py: '12' })}>
          <Spinner />
        </div>
      ) : (
        <DataTable
          data={users}
          columns={columns}
          classNames={{ table: {} }}
          emptyMessage={t('admin.users.empty', 'No users found')}
          getRowId={(row) => row.id}
        />
      )}
    </div>
  );
}
