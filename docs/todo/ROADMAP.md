# @finografic/monorepo-starter — Roadmap

> **Status:** Starter refresh complete through branding, shadcn/Tailwind, TypeScript 7, syncpack 15,
> and SQLite runtime validation.
> 📅 2026-08-16

This roadmap is the high-level sequencing plan for turning this repo into a selective-extraction
starter based on `/Users/justin/repos-finografic/touch-monorepo`.

## How to use this file

| Tier | Meaning                         |
| ---- | ------------------------------- |
| P0   | Active now                      |
| P1   | Next, fully scoped              |
| P2   | Planned, sequencing decided     |
| P3   | Backlog, intentionally deferred |

Detailed execution lives in:

- [TODO — Phase 01 Root Bootstrap](/docs/todo/TODO_PHASE_01_ROOT_BOOTSTRAP.md)
- [TODO — Phase 02 App Shell Extraction](/docs/todo/TODO_PHASE_02_APP_SHELL_EXTRACTION.md)
- [TODO — Phase 03 Shared Platform Extraction](/docs/todo/TODO_PHASE_03_SHARED_PLATFORM_EXTRACTION.md)
- [TODO — Phase 04 Data Auth and I18n](/docs/todo/TODO_PHASE_04_DATA_AUTH_AND_I18N.md)
- [TODO — Phase 06 LLAAB Client/Server Patterns](/docs/todo/TODO_PHASE_06_LLAAB_CLIENT_SERVER_PATTERNS.md)
- [TODO — Phase 07 Shadcn Tailwind Migration](/docs/todo/TODO_PHASE_07_SHADCN_TAILWIND_MIGRATION.md)
- [TODO — PostgreSQL Migration](/docs/todo/TODO_POSTGRES_MIGRATION.md)
- [DONE — Grid Layout Migration](/docs/todo/DONE_GRID_LAYOUT_MIGRATION.md)
- [DONE — Monorepo Starter Update](/docs/todo/DONE_MONOREPO_STARTER_UPDATE.md)

## Next

> **Context:** Core starter work is complete. Current follow-up work should focus on tests, CI, and
> explicitly selected optional migrations.
> `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build`, and `pnpm syncpack:lint` pass.

📅 2026-08-16

---

## Phase 4A — Auth Routes + Server Env ✅ DONE

- [x] `apps/server/env.server.ts` — Valibot-validated, merges shared env, builds `COOKIES` object + `COOKIE_DELETE_ATTRIBUTES`
- [x] `apps/server/tsconfig.json` — path aliases: `env.server`, `db`, `db/*`, `lib/*`, `routes/*`, `utils/*`
- [x] `src/lib/auth.ts` — `getAuthConfig()` for `@hono/auth-js`, JWT strategy, role in session
- [x] `src/lib/auth-secret.runtime.ts` — ephemeral secret in dev, stable in prod
- [x] `src/lib/valibot.utils.ts` — `sqliteBooleanField()` helper matching touch-monorepo
- [x] `src/routes/auth/auth.route.ts` — sign-up, clear-all-cookies, `authHandler()`
- [x] `src/app.ts` — `initAuthConfig` middleware wired
- [x] `.env.development` / `.env.example` — updated with auth + cookie fields
- [x] `data/*.sqlite.db` already covered by `.gitignore`

---

## Phase 4B — i18n Tables + Routes ✅ DONE

- [x] `src/db/schemas/supported-languages.schema.ts`
- [x] `src/db/schemas/translations-ui.schema.ts`
- [x] `src/db/schemas/translations-app.schema.ts`
- [x] `src/db/schemas/translations-admin.schema.ts`
- [x] `src/routes/i18n/i18n.route.ts`
  - `GET /api/i18n/:namespace?lng=` — bulk domain-grouped load for i18next
  - `GET /api/i18n/translations/:domain?lng=` — single domain array for CMS
- [x] Seed: `supported-languages` (en-GB default + es-ES)
- [x] Seed: `translations-ui` (22 entries), `translations-app` (12), `translations-admin` (19)
- [x] `src/db/seed.ts` — orchestrated, idempotent, picocolors output

---

## Phase 4C — Client i18n Integration ✅ DONE

- [x] `src/i18n/i18n.config.ts` — HTTP backend `/api/i18n/translations?lng=`, localStorage detection
- [x] `src/i18n/i18n.constants.ts` — `SUPPORTED_LANGUAGES`, `DEFAULT_LANGUAGE`, `LOCALE_MAPPING`
- [x] `I18nextProvider` added to `main.tsx`
- [x] `src/components/LanguageSwitcher/LanguageSwitcher.tsx` — en-GB / es-ES toggle with DS tokens

---

## Phase 4D — Client Pages + Admin Dashboard ✅ DONE

### Server

- [x] `src/lib/require-auth.ts` — `requireAuth()` using `verifyAuth()` from `@hono/auth-js`
- [x] `src/lib/require-role.ts` — `requireRole('admin')` checks session role via `getAuthUser(c)`
- [x] `src/routes/users/users.route.ts` — `GET /api/users` (admin), `PATCH`, `DELETE`
- [x] `src/routes/translations/translations.route.ts` — `PATCH /api/translations/:domain/:id` (admin)

### Client

- [x] `src/lib/auth-client.ts` — CSRF-aware sign-in/sign-up/sign-out (opaqueredirect pattern)
- [x] `src/context/AuthContext.tsx` — `AuthProvider` + `useAuth()`, useMemo value, visibilitychange refresh
- [x] `src/components/ProtectedRoute.tsx` — role-aware guard with Spinner fallback
- [x] `src/layout/AdminLayout.tsx` — sidebar nav + topbar (AvatarDS, sign-out)
- [x] `src/layout/Layout.tsx` — updated header with auth state, role badge, language switcher
- [x] `src/pages/LoginPage.tsx` — sign-in / sign-up toggle with DS Card + Button
- [x] `src/pages/LandingPage.tsx` — hero + feature grid redesign (DS Badge, Card)
- [x] `src/pages/admin/AdminDashboardPage.tsx` — stat cards
- [x] `src/pages/admin/AdminUsersPage.tsx` — DataTable with inline role editing
- [x] `src/pages/admin/AdminTranslationsPage.tsx` — TabsDS with per-domain inline editor
- [x] `src/pages/admin/AdminSettingsPage.tsx` — placeholder

---

## Phase 4E — Design System Integration ✅ DONE

### Why

The starter doubles as a portfolio piece — design-system usage must be visible and polished.

### Source

`/Users/justin/repos-finografic/cv-justin-rankin` — superior Panda CSS + design-system Vite config.

### Tasks

- [x] Verify `apps/client/vite.config.ts` matches cv-justin-rankin's Panda CSS setup
- [x] Verify `panda.config.ts` in `apps/client` uses `@finografic/design-system` preset correctly
- [x] Landing page uses DS tokens: `color.brand.*`, spacing, typography scale
- [x] Admin dashboard uses DS components: `Card`, `Button`, `Badge`, `Table`, `Input`, `Select`
- [x] Ensure DS peer dependencies (`react`, `react-dom`) match client versions
- [x] `pnpm build` end-to-end — Panda CSS generates, DS components render in build

---

## Phase 4F — Polish + Validation

### Tasks

- [ ] Full `pnpm install && pnpm build && pnpm dev` validation from clean state
- [ ] End-to-end flow: landing → login → dashboard → users table → translations editor
- [ ] Sign-up flow on `/login` page (toggle form mode)
- [ ] `clear-all-cookies` endpoint tested (useful for debugging)
- [ ] Auth cookie name confirms `monorepo-starter.session_token` in DevTools
- [ ] i18n language switch persists across page refresh (browser language detector)
- [x] Typecheck: `pnpm typecheck` passes across all packages
- [ ] Update `ROADMAP.md` Done table

---

## Phase 5 — Observability + Developer Experience ✅ DONE

Elevates this from "functional starter" to "reference implementation worth showing in a portfolio."

### Tasks

- [x] **OpenAPI / Scalar** — `hono-openapi` + `@scalar/hono-api-reference`; all endpoints annotated with `describeRoute`; interactive docs at `/api/reference`
- [x] **Request logging** — `hono-pino` with picocolors dev destination (no thread-stream); wired into `create-app.ts` via `AppBindings`
- [x] **Error shape** — `{ error, message }` envelope on all routes; `notFound` and `onError` updated
- [x] **Rate limiting** — in-memory rate limiter (no extra deps); 5 req/min on sign-up, 10 req/min on sign-in

---

## Phase 6 — Testing

- [ ] Vitest unit tests for `password.utils.ts` (hash + verify)
- [ ] Vitest unit tests for i18n `buildDomainGroupedResources` logic
- [ ] Vitest integration tests for auth routes (`sign-up`, `sign-in`, `signout`)
- [ ] Vitest integration tests for i18n routes (`GET /api/i18n/translations`)
- [ ] CI workflow (`ci.yml`) — install + typecheck + build + test on push/PR

---

## Phase 7 — Optional Enhancements

These are natural extensions once the starter is stable and demonstrated.

- [ ] **React Query** (`@tanstack/react-query`) for client data fetching in admin
- [ ] **Optimistic updates** in translations editor (shows off React Query mutation pattern)
- [ ] **`packages/shared`** — extract shared DTOs (user, translation) if they emerge during CMS
- [ ] **Dark mode** — design-system token switch, persisted in localStorage
- [ ] **Email verification** — extend auth flow with a verification token table + email send
- [ ] **OAuth provider** — add GitHub or Google provider to Auth.js config as a demo

---

## Key Principles

1. **Server first, client second** — routes/schemas must exist before UI can consume them.
2. **Owned UI primitives** — keep reusable shadcn/Tailwind components in `@workspace/ui`.
3. **Follow source patterns** — match touch-monorepo's route/handler/schema structure exactly.
4. **Starter-grade, not production** — auth is real but minimal; CMS is functional but not feature-complete.
5. **Small batches with cleanup** — commit checkpoint after each sub-phase.
6. **Intentional UX** — every page should look purposeful without adding product-specific sample apps.

## P0 — Active

- ~~Migrate the client UI layer from `@finografic/design-system` + Panda CSS to shadcn + Tailwind 4
  using the proven LLAAB package/layout patterns.~~ **Complete.** Detail: [TODO — Phase 07 Shadcn Tailwind Migration](/docs/todo/TODO_PHASE_07_SHADCN_TAILWIND_MIGRATION.md)
- ~~Adopt the newer LLAAB client/server architecture patterns: Vite 8, Hono RPC, TanStack Query,
  route-folder server structure, and React Router data-router setup.~~ **Complete.** Detail: [TODO — Phase 06 LLAAB Client/Server Patterns](/docs/todo/TODO_PHASE_06_LLAAB_CLIENT_SERVER_PATTERNS.md)
- ~~Root monorepo bootstrap and planning docs.~~ **Complete.** Detail: [TODO — Phase 01 Root Bootstrap](/docs/todo/TODO_PHASE_01_ROOT_BOOTSTRAP.md)
- ~~Refresh branding, public shell, i18n seeds, toolchain policy, and TypeScript baseline.~~ **Complete.**
  Detail: [DONE — Monorepo Starter Update](/docs/todo/DONE_MONOREPO_STARTER_UPDATE.md)

## P1 — Next Up

- ~~Migrate `apps/client` page/section Tailwind multi-column layouts to `@workspace/ui` `Container` /
  `Row` / `Col`.~~ **Complete.** Detail: [DONE — Grid Layout Migration](/docs/todo/DONE_GRID_LAYOUT_MIGRATION.md)
- ~~Extract minimal `apps/client` and `apps/server` shells from the source repo without business features.~~ **Complete.** Detail: [TODO — Phase 02 App Shell Extraction](/docs/todo/TODO_PHASE_02_APP_SHELL_EXTRACTION.md)

## P2 — Planned

- ~~Reintroduce shared packages only where they remain generic after cleanup.~~ **Complete.** Detail: [TODO — Phase 03 Shared Platform Extraction](/docs/todo/TODO_PHASE_03_SHARED_PLATFORM_EXTRACTION.md)
- ~~Add optional platform layers for Drizzle, Auth.js, and i18next as starter-grade skeletons, not full product implementations.~~ **Complete.** Detail: [TODO — Phase 04 Data Auth and I18n](/docs/todo/TODO_PHASE_04_DATA_AUTH_AND_I18N.md)

## P3 — Backlog

- Add example tests and CI once the package graph stabilises.
- Decide whether the starter should ship release/versioning automation or remain app-only.
- Add a starter-focused example content/data set after the dashboard shell exists.
- ~~Revisit TypeScript 7 after the i18n package peer dependency chain supports it.~~ **Complete** — TypeScript 7.0.2.

## Non-starters

- Do not copy the source monorepo wholesale and trim later.
- All internal packages use the `@workspace/*` scope — this is intentional, not a leftover from the source.
- Do not migrate deployment scripts, release flows, or production-only operational tooling yet.
- Do not pull over source business routes, seed data, or domain-specific admin features in early phases.

## Checkpoints

- Prefer small extraction batches with cleanup before the next copy step.
- Use commit checkpoints between phases once the workspace installs and validates cleanly.
- When copied code reveals hidden coupling, trim dependencies before extracting more surface area.

## Done

| Date       | Item                                                                         |
| ---------- | ---------------------------------------------------------------------------- |
| 2026-05-27 | Initial repo scaffolding files added                                         |
| 2026-05-27 | Root roadmap created                                                         |
| 2026-05-27 | Root monorepo config baseline and phased extraction plan established         |
| 2026-05-27 | Phase 01 complete — workspace packages created, install/typecheck pass       |
| 2026-05-27 | Phase 02 complete — client and server app shells extracted and building      |
| 2026-05-27 | Phase 03 complete — config extracted, core/shared skipped after evaluation   |
| 2026-05-27 | Phase 04A complete — auth routes, server env, JWT strategy, cookie config    |
| 2026-05-27 | Phase 04B complete — i18n schemas, seed data, GET /api/i18n routes           |
| 2026-05-27 | Phase 04C complete — i18next HTTP backend, language detection, switcher      |
| 2026-05-27 | Phase 04D complete — auth guards, admin CRUD routes, full client UI          |
| 2026-05-27 | Phase 04E complete — DS/Panda config verified; build + typecheck all green   |
| 2026-05-27 | Phase 05 complete — pino logging, OpenAPI/Scalar, error envelope, rate limit |
| 2026-06-28 | Phase 06 complete — Vite 8, Hono RPC, TanStack Query, route-tree migration   |
| 2026-06-28 | Phase 07 complete — shadcn/Tailwind UI package migration                     |
| 2026-07-14 | Grid layout migration — Landing + AdminDashboard on `@workspace/ui` Row/Col  |
| 2026-08-16 | Starter update — branding, shell, i18n, syncpack, TS6, SQLite validation     |
| 2026-08-17 | TypeScript 6.0.3 → 7.0.2                                                     |
