# monorepo-starter — Handoff

## Project

`@finografic/monorepo-starter` — Full-stack TypeScript monorepo starter built as a portfolio piece.
Extracted selectively from `/Users/justin/repos-finografic/touch-monorepo`.

**Phase status:** Phases 01–05 complete. Phase 06 (testing + CI) is next.

---

## Architecture

```
monorepo-starter/
├── apps/
│   ├── client/          Vite 7 + React 19 + Panda CSS + @finografic/design-system
│   └── server/          Hono + @hono/node-server + Drizzle ORM + Auth.js
├── config/              @workspace/config — Valibot env validation + dotenv
├── packages/            (empty — core/shared intentionally skipped)
└── pnpm-workspace.yaml  declares config, packages/*, apps/*
```

**Client** (`apps/client`) — port 3000, proxies `/api` → server
**Server** (`apps/server`) — port 4000, serves `/api/*`
**Config** (`config/`) — shared env schema, root-dir discovery, workspace paths

---

## Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| Runtime        | Node.js, pnpm, Turbo                                           |
| Server         | Hono, @hono/node-server, @hono/auth-js, hono-openapi           |
| Database       | better-sqlite3, Drizzle ORM, drizzle-valibot                   |
| Auth           | @auth/core (Auth.js), JWT strategy, credentials provider       |
| Validation     | Valibot (server + client)                                      |
| Client         | React 19, React Router v6, react-i18next, i18next-http-backend |
| Styling        | Panda CSS, @finografic/design-system (preset + components)     |
| Logging        | hono-pino + pino (picocolors dev destination)                  |
| API Docs       | hono-openapi + @scalar/hono-api-reference                      |
| Build (server) | tsdown (rolldown)                                              |
| Build (client) | Vite 7                                                         |
| Lint           | oxlint (root config + per-app configs)                         |
| Type check     | tsc --noEmit (all packages)                                    |

---

## Server Route Map

| Method | Path                           | Auth          | Description                          |
| ------ | ------------------------------ | ------------- | ------------------------------------ |
| GET    | /api/health                    | public        | Liveness check                       |
| GET    | /api/demo                      | public        | Demo hello-world                     |
| POST   | /api/auth/sign-up              | public        | Register new account (rate-limited)  |
| POST   | /api/auth/clear-all-cookies    | public        | Debug: wipe all auth cookies         |
| \*     | /api/auth/\*                   | public        | Auth.js standard routes              |
| GET    | /api/i18n/:namespace           | public        | i18next bulk bundle load             |
| GET    | /api/i18n/translations/:domain | public        | Per-domain CMS list                  |
| GET    | /api/users                     | admin         | List all users                       |
| PATCH  | /api/users/:id                 | authenticated | Update user (admin: any; user: self) |
| DELETE | /api/users/:id                 | admin         | Delete user                          |
| PATCH  | /api/translations/:domain/:id  | admin         | Update translation entry             |
| GET    | /api/doc                       | public        | OpenAPI 3.1 JSON spec                |
| GET    | /api/reference                 | public        | Scalar interactive API docs          |

---

## Client Route Map

| Path                | Guard         | Component                          |
| ------------------- | ------------- | ---------------------------------- |
| /                   | public        | LandingPage                        |
| /login              | public        | LoginPage (sign-in/sign-up toggle) |
| /dashboard          | authenticated | DashboardPage                      |
| /admin              | role=admin    | AdminLayout (nested)               |
| /admin              | role=admin    | AdminDashboardPage                 |
| /admin/users        | role=admin    | AdminUsersPage                     |
| /admin/translations | role=admin    | AdminTranslationsPage              |
| /admin/settings     | role=admin    | AdminSettingsPage                  |

---

## Database Schema

All tables in `apps/server/src/db/schemas/`:

| Table                 | Key columns                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| `user`                | id, name, email, hashedPassword, role, emailVerified, createdAt, updatedAt |
| `session`             | id, userId, expires, sessionToken                                          |
| `account`             | id, userId, provider, providerAccountId, ...                               |
| `verification_token`  | identifier, token, expires                                                 |
| `supported_languages` | id, code, name, isDefault, isActive                                        |
| `translations_ui`     | id, key, translations (JSON), isActive                                     |
| `translations_app`    | id, key, translations (JSON), isActive                                     |
| `translations_admin`  | id, key, translations (JSON), isActive                                     |

Seed: en-GB (default) + es-ES; 22 UI + 12 app + 19 admin translation keys.

---

## Key Files

| File                                            | Purpose                                                  |
| ----------------------------------------------- | -------------------------------------------------------- |
| `apps/server/env.server.ts`                     | Server env schema (Valibot + shared env)                 |
| `apps/server/src/types/app.types.ts`            | `AppBindings`, `AppOpenAPI`, `AppHandler`, `AppContext`  |
| `apps/server/src/lib/create-app.ts`             | App factory; wires pino, notFound, onError               |
| `apps/server/src/lib/auth.ts`                   | `getAuthConfig()` — Auth.js config factory               |
| `apps/server/src/lib/configure-openapi.ts`      | Registers `/api/doc` + `/api/reference`                  |
| `apps/server/src/lib/require-auth.ts`           | `requireAuth()` — wraps `verifyAuth()`                   |
| `apps/server/src/lib/require-role.ts`           | `requireRole('admin')` — checks session role             |
| `apps/server/src/middlewares/pino-logger.ts`    | Request logger (picocolors dev, JSON prod)               |
| `apps/server/src/middlewares/rate-limit.ts`     | In-memory rate limiter middleware                        |
| `apps/client/src/context/AuthContext.tsx`       | `AuthProvider` + `useAuth()` hook                        |
| `apps/client/src/components/ProtectedRoute.tsx` | Role-aware route guard                                   |
| `apps/client/src/i18n/i18n.config.ts`           | i18next HTTP backend + localStorage detection            |
| `apps/client/panda.config.ts`                   | Panda CSS config with `@finografic/design-system` preset |
| `config/src/env.ts`                             | Shared env schema (`@workspace/config`)                  |

---

## Design System Notes

- Import components from `@finografic/design-system`
- Use `AvatarDS` (not `Avatar` — that's a compound namespace)
- `Text` component: `color` takes semantic names only (`"muted"`, `"error"`, not token paths)
- `Badge` palette: `"primary" | "success" | "warning" | "danger" | "info" | "neutral"`
- `Button`: no `asChild`; use styled `<Link>` with `css({})` for navigation CTAs
- `DataTable`: requires `classNames: { table: DataTableTableClassNames }`

---

## Decisions

1. Used custom picocolors pino destination instead of pino-pretty to avoid worker-thread crashes. (2026-05-27)
2. `sqliteBooleanField()` returns `0|1`; a `normalisePatch()` helper converts to `boolean` for Drizzle `.set()`. (2026-05-27)
3. Root-level oxlint config is what lint-staged runs — app-level overrides only apply to `pnpm lint` within each app. (2026-05-27)
4. `packages/core` and `packages/shared` from source intentionally skipped — no generalisable code identified. (2026-05-27)
5. No GitHub Pages / deployment workflow — unsuitable for a full-stack monorepo server. (2026-05-27)

---

## Open Questions

- Phase 4F browser validation still pending (cookie names in DevTools, i18n persistence, end-to-end user flow).
- Rate limiter is in-memory and resets on restart — acceptable for starter; note if deploying multi-process.

---

## Status

Phase 05 complete. Next: **Phase 06 — Testing + CI**.

Remaining work (from `docs/todo/NEXT_STEPS.md`):

- Vitest unit tests: `password.utils.ts`, `buildDomainGroupedResources`
- Vitest integration tests: auth routes, i18n routes
- GitHub Actions CI workflow: install + typecheck + build + test

Phase 5 changes are uncommitted. Run `pnpm build` and `pnpm typecheck` to confirm green before committing.
