import { Badge, DataTable, Spinner } from '@finografic/design-system';
import type { DataTableColumn } from '@finografic/design-system';
import { css } from '@styled-system/css';
import { useUpdateUser, useUsers } from 'queries/users';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserRole, UserRow } from 'queries/users';

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
  borderColor: 'border',
  bg: 'bg.surface',
  cursor: 'pointer',
});

interface RoleCellProps {
  user: UserRow;
  updatingId: string | null;
  onUpdateRole: (id: string, role: UserRole) => void;
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
  const usersQuery = useUsers();
  const updateUser = useUpdateUser();
  const updatingId = updateUser.isPending ? updateUser.variables.id : null;

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
            onUpdateRole={(id, role) => updateUser.mutate({ id, role })}
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
    [t, updatingId, updateUser],
  );

  return (
    <div>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'fg' })}>
        {t('admin.pages.users.title', 'Users')}
      </h1>
      <p className={css({ fontSize: 'sm', color: 'fg.muted', mt: '1', mb: '6' })}>
        {t('admin.pages.users.subtitle', 'Manage accounts and roles')}
      </p>

      {usersQuery.error && (
        <p className={css({ fontSize: 'sm', color: 'fg.error', mb: '4' })}>
          {usersQuery.error instanceof Error ? usersQuery.error.message : 'Failed to load users'}
        </p>
      )}

      {usersQuery.isLoading ? (
        <div className={css({ display: 'flex', justifyContent: 'center', py: '12' })}>
          <Spinner />
        </div>
      ) : (
        <DataTable
          data={usersQuery.data ?? []}
          columns={columns}
          classNames={{ table: {} }}
          emptyMessage={t('admin.users.empty', 'No users found')}
          getRowId={(row) => row.id}
        />
      )}
    </div>
  );
}
