# Client Guide — Vite + React Router

> Quick reference for the `apps/client` SPA after the Phase 06 LLAAB-pattern migration.

## Stack

| Layer   | Choice                                      |
| ------- | ------------------------------------------- |
| Bundler | Vite 8                                      |
| UI      | React 19 + `@finografic/design-system` now  |
| Router  | React Router v7 with `createBrowserRouter`  |
| Data    | TanStack Query + Hono RPC via `src/lib/api` |
| Styles  | Panda CSS + design-system preset now        |

Tailwind 4, shadcn, and `packages/ui` are intentionally deferred. See
`docs/todo/TODO_PHASE_06_LLAAB_CLIENT_SERVER_PATTERNS.md` for the later shadcn migration notes.

## Project Layout

```text
apps/client/
  index.html
  vite.config.ts
  src/
    main.tsx                    # root providers
    App.tsx                     # RouterProvider + dev-only CSS smoke marker
    router.tsx                  # createBrowserRouter route tree
    components/                 # shared client components
    context/                    # AuthProvider / useAuth
    layout/                     # public and admin layout shells
    pages/                      # route page components
    providers/
      QueryClientProvider/      # TanStack Query client provider
    queries/                    # TanStack Query hooks
    lib/api.ts                  # typed Hono RPC client
    styles/theme.css            # Panda/design-system layer setup
```

## Providers

`main.tsx` owns global provider order:

1. `I18nextProvider`
2. `QueryClientProvider`
3. `AuthProvider`
4. `App`

Put future app-wide providers under `src/providers/` rather than expanding `main.tsx` with inline
setup logic.

## Adding a Route

1. Create a page component under `src/pages/`.
2. Register it in `src/router.tsx`.
3. Use `Layout` for public/authenticated routes or `AdminLayout` for admin routes.
4. Wrap protected route elements with `ProtectedRoute`.

Route guards currently remain component wrappers. Move them to React Router loaders only if that
becomes useful after the query/auth layer settles.

## Data Fetching

Use query hooks under `src/queries/*`. Do not call `fetch('/api/...')` directly from pages when a
typed Hono RPC route is available.

Current query groups:

| Query group     | Purpose                           |
| --------------- | --------------------------------- |
| `users/`        | Admin user list and role updates  |
| `translations/` | Translation CMS lists and updates |

`src/lib/api.ts` exports the typed Hono RPC client:

```ts
import { api } from 'lib/api';

const res = await api.users.$get();
```

Auth.js credential callback helpers remain in `src/lib/auth-client.ts` because Auth.js wildcard
routes are not a great fit for Hono RPC typing.

## Auth

This starter uses DB-backed Auth.js/session auth. Do not copy LLAAB's basic password auth.

The client auth boundary is:

- `src/lib/auth-client.ts` for CSRF-aware Auth.js calls.
- `src/context/AuthContext.tsx` for auth state and page-facing actions.
- `src/components/ProtectedRoute.tsx` for route protection.

## Dev

| Mode       | Client URL              | API proxy               |
| ---------- | ----------------------- | ----------------------- |
| `pnpm dev` | `http://localhost:3000` | Vite proxy → `API_PORT` |

Run both apps from the repo root with:

```sh
pnpm dev
```

## Styling

Current styling is Panda CSS with `@finografic/design-system`.

- Import generated Panda styles from `@styled-system/styles.css`.
- Keep design-system/Panda aliases in both `vite.config.ts` and `tsconfig.json`.
- Use valid semantic tokens such as `bg`, `fg`, `border`, `accent`, `accent.subtle`, and `fg.error`.

## Common Pitfalls

| Symptom                     | Fix                                                    |
| --------------------------- | ------------------------------------------------------ |
| QueryClient error           | Ensure the component is under `QueryClientProvider`    |
| API client type missing     | Build `@workspace/server` so `dist/index.d.mts` exists |
| Alias not resolving in Vite | Add it to `vite.config.ts` and `tsconfig.json`         |
| Auth session missing        | Check `/api/auth/session`, cookies, and server logs    |
