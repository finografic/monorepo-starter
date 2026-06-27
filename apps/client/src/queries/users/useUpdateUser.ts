import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserRole, UserRow } from './useUsers';

import { api } from 'lib/api';

import { QUERY_KEYS } from './index';

interface UpdateUserInput {
  id: string;
  role: UserRole;
}

async function updateUser({ id, role }: UpdateUserInput): Promise<UserRow> {
  const res = await api.users[':id'].$patch({
    param: { id },
    json: { role },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as UserRow;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.list() });
    },
  });
}
