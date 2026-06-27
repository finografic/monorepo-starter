import { QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { queryClient } from './queryClient';

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>;
}
