export const QUERY_KEYS = {
  users: {
    all: ['users'] as const,
    list: () => [...QUERY_KEYS.users.all, 'list'] as const,
  },
};

export { useUpdateUser } from './useUpdateUser';
export { useUsers } from './useUsers';
export type { UserRole, UserRow } from './useUsers';
