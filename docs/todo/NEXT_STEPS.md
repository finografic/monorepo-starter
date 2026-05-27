# Next Steps — Recommended Implementation Order

> **Context:** Phases 01–03 are complete. Phase 04 is in progress — design-system and Drizzle auth
> schemas are wired up. This document captures the recommended path forward.

📅 2026-05-27

---

## Phase 4A — Auth Routes + Server Env (next immediate)

### Why first

Auth is the backbone for the admin/CMS — nothing behind a login can work without it.

### Tasks

- [ ] Add server-specific env layer (`apps/server/env.server.ts`) extending `@workspace/config/env`.
  - Fields: `DB_NAME`, `DB_PATH`, `AUTH_SECRET`, `AUTH_COOKIE_PREFIX`, cookie suffixes.
  - Merges with shared env using the same Valibot pattern from touch-monorepo.
- [ ] Add auth library (`src/lib/auth.ts`) with `@auth/core` Credentials provider + JWT strategy.
  - `getAuthConfig()` function for `@hono/auth-js` integration.
  - Session callbacks exposing `user.id` and `user.role` on the JWT/session.
- [ ] Add auth route (`src/routes/auth/auth.route.ts`) following established route pattern:
  - `POST /api/auth/sign-up` — custom registration (Auth.js doesn't handle this).
  - `POST /api/auth/clear-all-cookies` — dev/debug helper.
  - `USE /api/auth/*` — Auth.js handler (session, csrf, signin, signout, callback).
- [ ] Wire `initAuthConfig` middleware in `src/app.ts`.
- [ ] Create the `data/` directory and add `data/*.sqlite.db` to `.gitignore`.
- [ ] Test: `db:push` creates tables, `db:seed` creates admin + demo user, sign-in flow works.

---

## Phase 4B — i18n Tables + Routes

### Why second

Translation tables are another DB concern that should land alongside auth while the DB layer is fresh.

### Tasks

- [ ] Add `supported_languages` schema (id, isoCode, nativeName, displayName, isActive, isDefault, sortOrder).
- [ ] Add 3 translation schemas: `translations_ui`, `translations_app`, `translations_admin`.
  - All share: `id`, `key` (unique, dot-notation), `translations` (JSON `Record<string, string>`), `isActive`, timestamps.
- [ ] Add i18n route (`src/routes/i18n/`) with two endpoints:
  - `GET /api/i18n/:namespace` — bulk load all domains grouped for i18next.
  - `GET /api/i18n/translations/:domain` — single domain array for CMS editing.
- [ ] Seed supported languages: `en-GB` (default) + `es-ES`.
- [ ] Seed starter translations for each domain (small representative set).
- [ ] Update `db:push` and `db:seed` to include i18n tables.

---

## Phase 4C — Client i18n Integration

### Why third

Once the server serves translations, the client can consume them.

### Tasks

- [ ] Install `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`.
- [ ] Create `src/i18n.config.ts` with HTTP backend pointing at `/api/i18n/translations`.
- [ ] Add `I18nextProvider` to `main.tsx`.
- [ ] Add language switcher component (en-GB / es-ES toggle).
- [ ] Verify translations load and switch at runtime.

---

## Phase 4D — Client Pages + Admin Dashboard

### Why fourth

Pages depend on design-system, auth context, and i18n all being available.

### Tasks

- [ ] **Landing / Splash page** — uses `@finografic/design-system` components, i18n strings.
  - Hero section, feature highlights, call-to-action.
  - Demonstrates design-system usage as a portfolio piece.
- [ ] **Login page** — form submitting to `/api/auth/signin/credentials`.
- [ ] **Admin dashboard layout** — protected route, sidebar nav, header with user info.
- [ ] **3 CMS sections** (admin sub-routes):
  1. **Users** — list users from `/api/users` (admin-only).
  2. **Translations** — view/edit translations from `/api/i18n/translations/:domain`.
  3. **Settings** — app configuration placeholder (extensible).
- [ ] Add server routes to support CMS: `GET /api/users` (admin), CRUD for translations.
- [ ] Auth guard middleware for admin routes (check `role === 'admin'`).

---

## Phase 4E — Polish + Validation

### Tasks

- [ ] Full `pnpm install && pnpm build && pnpm dev` validation.
- [ ] Verify the end-to-end flow: landing → login → dashboard → CMS sections.
- [ ] Ensure design-system components render correctly with Panda tokens.
- [ ] Clean up any remaining `@workspace/*` type errors or missing imports.
- [ ] Update `TODO_PHASE_04_DATA_AUTH_AND_I18N.md` to mark complete.
- [ ] Update `ROADMAP.md` Done table.

---

## Phase 5 (Future) — Optional Enhancements

These are NOT part of Phase 04 but are natural extensions once the starter is stable.

- [ ] Add Vitest tests for auth routes and password utils.
- [ ] Add CI workflow (`ci.yml`) that runs install + typecheck + build + test.
- [ ] Consider React Query (`@tanstack/react-query`) for client data fetching.
- [ ] Consider OpenAPI/Scalar for server route documentation.
- [ ] Add `packages/shared` if cross-app DTOs emerge during CMS development.
- [ ] Evaluate whether `packages/i18n` as a separate package (like touch-monorepo) is warranted, or if the config + server routes are sufficient for this starter.

---

## Key Principles

1. **Small batches with cleanup** — commit checkpoint after each sub-phase.
2. **Server first, client second** — routes/schemas must exist before UI can consume them.
3. **Design-system as portfolio** — use DS components on landing page and admin to showcase the system.
4. **Starter-grade, not production** — auth is real but minimal; CMS is functional but not feature-complete.
5. **Follow source patterns** — match touch-monorepo's route/handler/schema structure exactly.
