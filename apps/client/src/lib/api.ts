/**
 * Hono RPC client typed from the server route tree.
 *
 * In dev, Vite proxies /api/* to apps/server. Requests stay same-origin so auth cookies work.
 */

import { hc } from 'hono/client';
import type { AppType } from '../../../server/src/app';

const baseUrl = globalThis.window?.location.origin ?? 'http://localhost:3000';

const client = hc<AppType>(baseUrl, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
  headers: () => ({ 'Content-Type': 'application/json' }),
});

/** Typed API client. Mirrors the server's route tree. */
export const { api } = client;
