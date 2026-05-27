# Next Steps — Recommended Implementation Order

> **Context:** Phases 01–03 are complete. Phase 04 is in progress — design-system, Drizzle auth
> schemas, env.server, auth routes, and i18n (tables + routes + seeds) are all wired up.

📅 2026-05-27

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

## Phase 4C — Client i18n Integration (next)

### Why

Once the server serves translations, the client can consume them — and the language switcher feeds into the landing page demo.

### Tasks

- [ ] Install `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`
- [ ] `src/i18n/i18n.config.ts` — HTTP backend pointing at `/api/i18n/translations`
- [ ] `src/i18n/i18n.types.ts` — TypeScript types for translation namespaces
- [ ] Add `I18nextProvider` to `main.tsx`, wrap with `Suspense`
- [ ] `src/components/LanguageSwitcher.tsx` — en-GB / es-ES toggle, uses design-system tokens
- [ ] Verify translations load on first render and switch at runtime without flash

---

## Phase 4D — Client Pages + Admin Dashboard

### Why

Pages depend on design-system, auth context, and i18n all being available.

### Tasks

#### Server additions

- [ ] `src/routes/users/users.route.ts` — `GET /api/users` (admin-only), `PATCH /api/users/:id`, `DELETE /api/users/:id`
- [ ] `src/routes/translations/translations.route.ts` — `PATCH /api/translations/:domain/:id` (admin)
- [ ] Auth guard middleware `src/middlewares/require-auth.ts` — reject non-session requests
- [ ] Role guard middleware `src/middlewares/require-role.ts` — reject if `role !== 'admin'`

#### Client pages

- [ ] **`/` Landing / Splash page** — showcases `@finografic/design-system` components:
  - Hero with animated headline, i18n strings, language switcher
  - Feature grid (Hono, Panda CSS, Auth.js, i18n, SQLite, Turbo)
  - "Tech stack" section with design-system card components
  - CTA → `/login`
- [ ] **`/login` Login page** — sign-in form → `/api/auth/signin/credentials`
  - Error state, loading state, redirect to `/admin` on success
- [ ] **`/admin` Admin dashboard layout** — protected route, sidebar nav, header with user avatar + role badge
- [ ] **`/admin/users` Users CMS** — data table, inline role editing, delete with confirm
- [ ] **`/admin/translations` Translations CMS** — domain tabs (ui / app / admin), inline key editing, language toggle
- [ ] **`/admin/settings` Settings** — app metadata, supported languages toggle, language sort order

#### Client infrastructure

- [ ] `src/lib/auth-client.ts` — thin wrapper around `/api/auth/session` + sign-in/out
- [ ] `src/context/AuthContext.tsx` — session provider + `useAuth()` hook
- [ ] `src/components/ProtectedRoute.tsx` — wraps admin routes, redirects to `/login`
- [ ] `src/components/AdminLayout.tsx` — sidebar + topbar, uses design-system layout tokens

---

## Phase 4E — Design System Integration

### Why

The starter doubles as a portfolio piece — design-system usage must be visible and polished.

### Source

`/Users/justin/repos-finografic/cv-justin-rankin` — superior Panda CSS + design-system Vite config.

### Tasks

- [ ] Verify `apps/client/vite.config.ts` matches cv-justin-rankin's Panda CSS setup
- [ ] Verify `panda.config.ts` in `apps/client` uses `@finografic/design-system` preset correctly
- [ ] Landing page uses DS tokens: `color.brand.*`, spacing, typography scale
- [ ] Admin dashboard uses DS components: `Card`, `Button`, `Badge`, `Table`, `Input`, `Select`
- [ ] Ensure DS peer dependencies (`react`, `react-dom`) match client versions
- [ ] `pnpm build` end-to-end — Panda CSS generates, DS components render in build

---

## Phase 4F — Polish + Validation

### Tasks

- [ ] Full `pnpm install && pnpm build && pnpm dev` validation from clean state
- [ ] End-to-end flow: landing → login → dashboard → users table → translations editor
- [ ] Sign-up flow on `/login` page (toggle form mode)
- [ ] `clear-all-cookies` endpoint tested (useful for debugging)
- [ ] Auth cookie name confirms `monorepo-starter.session_token` in DevTools
- [ ] i18n language switch persists across page refresh (browser language detector)
- [ ] Typecheck: `pnpm typecheck` passes across all packages
- [ ] Update `ROADMAP.md` Done table

---

## Phase 5 — Observability + Developer Experience

Elevates this from "functional starter" to "reference implementation worth showing in a portfolio."

### Tasks

- [ ] **OpenAPI / Scalar** — add `hono-openapi` and `@scalar/hono-api-reference` to server
  - Route all public + admin endpoints through OpenAPI definitions
  - Serve interactive docs at `/api/reference`
  - This is a significant DX showcase item
- [ ] **Request logging** — add `hono-pino` middleware (already in touch-monorepo)
  - Structured JSON logs in production, pretty-print in dev
  - Wire into `src/lib/create-app.ts`
- [ ] **Error shape** — define a consistent `{ error, message, issues? }` JSON error envelope
  - Used by all routes and the frontend error boundary
- [ ] **Rate limiting** — simple in-memory rate limiter on `/api/auth/sign-up` and `/api/auth/signin`

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
2. **Design-system as portfolio** — use DS components on landing page and admin to showcase the system.
3. **Follow source patterns** — match touch-monorepo's route/handler/schema structure exactly.
4. **Starter-grade, not production** — auth is real but minimal; CMS is functional but not feature-complete.
5. **Small batches with cleanup** — commit checkpoint after each sub-phase.
6. **Demo-worthy UX** — every page should look intentional; this is a portfolio piece, not a boilerplate dump.
