# TODO — Phase 06 LLAAB Client/Server Patterns

> **Status:** Planned.
> 📅 2026-06-28

## Goal

Align the starter's client/server architecture with the newer LLAAB patterns while keeping this repo
starter-grade and removing LLAAB-only domains such as vault, ingestion, runs, and agent execution.

The target shape is:

| Layer   | Choice                                     |
| ------- | ------------------------------------------ |
| Bundler | Vite 8                                     |
| UI      | React 19 + design-system now; shadcn last  |
| Router  | React Router v7 with `createBrowserRouter` |
| Data    | TanStack Query + Hono RPC via `lib/api.ts` |
| Styles  | Panda CSS now; Tailwind 4 last             |

## Source References

Use these files as the source-of-truth patterns, adapting only the domain names and response shapes:

- `/Users/justin/LLAAB/apps/client/src/lib/api.ts`
- `/Users/justin/LLAAB/apps/client/src/queries`
- `/Users/justin/LLAAB/apps/server/src/routes/index.route.ts`
- `/Users/justin/LLAAB/apps/server/src/routes/AGENTS.md`

## Guardrails

- Do not copy vault, runs, crons, ingest, LLM, or agent routes into this starter.
- Do not copy LLAAB's basic password auth. Preserve this starter's DB-backed Auth.js/session auth.
- Only borrow LLAAB's route organization and Hono RPC typing pattern around the existing auth
  implementation.
- Keep Tailwind 4, shadcn, and `packages/ui` for the final styling phase.
- Keep `@finografic/design-system` and Panda CSS working until the styling migration begins.
- Prefer route/index files that only wire route definitions; implementation lives in named route files.
- Keep `index.ts` files as barrels or router wiring only, not implementation-heavy modules.
- Validate each phase with the narrow command that proves it works, then commit.

## Phase 06A — Vite 8 Upgrade

### Tasks

- [ ] Update `apps/client` from `vite@^7.1.10` to `vite@^8.1.0`.
- [ ] Update `@vitejs/plugin-react` from `^5.1.0` to `^6.0.3`.
- [ ] Refresh `pnpm-lock.yaml`.
- [ ] Run the client build once to catch Vite/plugin config drift.
- [ ] Update root package description if it still says Vite 7.

### Validation

- [ ] `pnpm --filter @workspace/client build`

## Phase 06B — Server Route Tree for Hono RPC

### Target Structure

```text
apps/server/src/routes/
  AGENTS.md
  index.route.ts
  auth/
    auth.routes.ts
    auth.schema.ts
    index.ts
  health/
    health.routes.ts
    index.ts
  i18n/
    i18n.routes.ts
    i18n.schema.ts
    index.ts
  translations/
    translations.routes.ts
    translations.schema.ts
    index.ts
  users/
    users.routes.ts
    users.schema.ts
    index.ts
```

### Tasks

- [ ] Add `apps/server/src/routes/AGENTS.md`, adapted from LLAAB for only this starter's route groups.
- [ ] Add `routes/index.route.ts` for `GET /`, returning starter server metadata.
- [ ] Convert current `*.route.ts` files into LLAAB-style group folders:
      route constants in `*.routes.ts`, validation schemas in `*.schema.ts`, router wiring in `index.ts`.
- [ ] Keep the current DB-backed Auth.js implementation in the `auth` group:
      sign-up, clear-all-cookies, credentials sign-in, session, CSRF, sign-out, and callback routes.
- [ ] Keep route group prefixes mounted in `app.ts`, for example `.route('/api/users', usersRouter)`.
- [ ] Remove the current pattern where each router internally includes `/users`, `/auth`, etc.
- [ ] Keep `describeRoute` OpenAPI metadata where useful, but do not let OpenAPI shape block RPC typing.
- [ ] Export `app` and `type AppType = typeof app` from `apps/server/src/app.ts`.
- [ ] Keep default export compatibility for `src/index.ts` if needed by the server entrypoint.

### Route Groups to Keep

| Prefix              | Router               | Purpose                      |
| ------------------- | -------------------- | ---------------------------- |
| `/`                 | `indexRouter`        | Server metadata / status     |
| `/api/health`       | `healthRouter`       | Health check                 |
| `/api/auth`         | `authRouter`         | Auth.js plus starter sign-up |
| `/api/i18n`         | `i18nRouter`         | i18next resources            |
| `/api/users`        | `usersRouter`        | Admin user CMS demo          |
| `/api/translations` | `translationsRouter` | Admin translation CMS demo   |

### Validation

- [ ] `pnpm --filter @workspace/server typecheck`
- [ ] `pnpm --filter @workspace/server build`

## Phase 06C — Client Hono RPC API Client

### Tasks

- [ ] Add `apps/client/src/lib/api.ts`, adapted from LLAAB.
- [ ] Import `type { AppType }` from the server app source or package export.
- [ ] Configure `hc<AppType>(baseUrl)` with `credentials: 'include'`.
- [ ] Keep `/api/*` same-origin so the Vite proxy continues to work.
- [ ] Replace direct `fetch('/api/...')` calls with `api.<group>...` calls where RPC typing is available.
- [ ] Keep Auth.js credential callback helpers in `auth-client.ts` if Hono RPC cannot represent the Auth.js wildcard routes cleanly.
- [ ] Do not replace Auth.js session fetching with LLAAB's basic `/auth/session` response shape.

### Validation

- [ ] `pnpm --filter @workspace/client typecheck`

## Phase 06D — TanStack Query Structure

### Target Structure

```text
apps/client/src/queries/
  auth/
    index.ts
    useSession.ts
  i18n/
    index.ts
    useTranslations.ts
  users/
    index.ts
    useUsers.ts
    useUpdateUser.ts
    useDeleteUser.ts
  translations/
    index.ts
    useTranslationDomains.ts
    useUpdateTranslation.ts
```

### Tasks

- [ ] Add `@tanstack/react-query`.
- [ ] Add a root `QueryClientProvider` in `main.tsx`, matching the LLAAB provider placement.
- [ ] Create query-folder `index.ts` files with local `QUERY_KEYS`.
- [ ] Move `AdminUsersPage` data loading and role updates into `queries/users`.
- [ ] Move `AdminTranslationsPage` data loading and updates into `queries/translations`.
- [ ] Consider a session query for `AuthContext`, but keep the existing Auth.js-backed context API stable for pages.
- [ ] Use mutation invalidation instead of manually patching page state where the query cache is authoritative.

### Validation

- [ ] `pnpm --filter @workspace/client typecheck`
- [ ] `pnpm --filter @workspace/client build`

## Phase 06E — React Router Data Router

### Tasks

- [ ] Add `apps/client/src/router.tsx`.
- [ ] Replace `<BrowserRouter><App /></BrowserRouter>` with `RouterProvider`.
- [ ] Convert `App.tsx` route declarations into `createBrowserRouter` route objects.
- [ ] Preserve existing layouts, protected routes, admin routes, and language switching behavior.
- [ ] Decide whether route guards remain wrapper components or become route loaders after the query layer settles.

### Validation

- [ ] `pnpm --filter @workspace/client typecheck`
- [ ] `pnpm --filter @workspace/client build`

## Phase 06F — Cleanup and Docs

### Tasks

- [ ] Remove dead fetch helpers after query hooks own data access.
- [ ] Update `apps/client/docs/GUIDE.md` to reflect this starter's actual choices.
- [ ] Update this TODO as phases complete.
- [ ] Update `docs/todo/ROADMAP.md` Done table.
- [ ] Run `graphify update .` after code changes.

### Validation

- [ ] `pnpm typecheck`
- [ ] `pnpm build`

## Deferred

- Tailwind 4 token migration.
- shadcn and `packages/ui`.
- LLAAB AI/provider pages and routes.
- LLAAB basic password auth.
- Vault, runs, ingestion, crons, and agent execution.

## Deferred Shadcn Migration Notes

When it is time to move from `@finografic/design-system` + Panda CSS to shadcn + Tailwind:

- Copy `packages/ui` from `/Users/justin/LLAAB` directly as the primary UI package source.
- Copy the relevant shadcn/Tailwind/client setup from LLAAB, but cross-check against the fresh
  generated reference repo at `/Users/justin/repos-finografic/vite-monorepo`.
- Use the shadcn preset `b7BE9nf27X` for the light-mode theme.
- Use this repo's generated theme CSS at `.agents/assets/globals.css` as the theme source.
- Consider copying selected files from `/Users/justin/LLAAB/apps/client/src/layouts`, especially
  the main app layout.
- Keep LLAAB as the architectural reference and `vite-monorepo` as the clean generated reference.
- Do this after Vite 8, Hono RPC, TanStack Query, server route folders, and React Router data
  routing are stable.
