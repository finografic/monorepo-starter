# Session Memory

> **How to maintain this file**
> Update during or at the end of a session with checklists, recent discoveries, and temporary context.
> — Keep only the recent tail unless there is a strong reason to preserve more.
> — If something becomes stable project truth, move it to `.agents/handoff.md`.
> — If something completes a milestone, record it in `docs/todo/ROADMAP.md`.
> — See `docs/process/PROJECT_MEMORY_MODEL.md`.

## Current session

- 2026-08-16: refreshed starter branding and landing page with Finografic logo/favicon/palette while
  keeping `LanguageSwitcher` visible.
- Removed project-local Graphify hooks/rules and documented lean-ctx workflow.
- Updated landing/shell i18n seeds, placeholder colour tokens, syncpack v15 policy, and TypeScript 6.
- Split the deferred SQLite-to-PostgreSQL work into `docs/todo/TODO_POSTGRES_MIGRATION.md`; SQLite
  remains the default database.
- Deferred TypeScript 7 until the i18n peer dependency chain supports it.

# Session Memory

> Gitignored. Add one entry per session, most recent first. Keep entries concise.
> Format: `## YYYY-MM-DD — <summary headline>`

---

## 2026-05-27 — Phases 4A–5 complete

### What was built

**Phase 4A — Auth Routes + Server Env**

- `env.server.ts` — Valibot-validated server env with `COOKIES` + `COOKIE_DELETE_ATTRIBUTES`
- `src/lib/auth.ts` — `getAuthConfig()` for `@hono/auth-js`, JWT strategy, role in session
- `src/lib/auth-secret.runtime.ts` — ephemeral secret in dev, stable in prod
- `src/routes/auth/auth.route.ts` — sign-up, clear-all-cookies, `authHandler()`
- `src/lib/valibot.utils.ts` — `sqliteBooleanField()` helper

**Phase 4B — i18n Tables + Routes**

- Schemas: `supported-languages`, `translations-ui`, `translations-app`, `translations-admin`
- `src/routes/i18n/i18n.route.ts` — bulk load + per-domain CMS endpoint
- `src/db/seed.ts` — idempotent seed for all tables (en-GB default + es-ES)

**Phase 4C — Client i18n**

- `src/i18n/i18n.config.ts` — HTTP backend, localStorage detection
- `src/components/LanguageSwitcher/LanguageSwitcher.tsx`

**Phase 4D — Auth Guards + Admin UI**

- Server: `requireAuth()`, `requireRole()`, users CRUD, translations PATCH
- Client: `AuthContext`, `ProtectedRoute`, `AdminLayout`, `Layout`, `LoginPage`, `LandingPage`
- Admin pages: Dashboard, Users (DataTable + inline role edit), Translations (TabsDS + inline editor), Settings

**Phase 4E — DS/Vite/Panda verification**

- `vite.config.ts` and `panda.config.ts` already matched cv-justin-rankin reference
- DS peer deps confirmed (`react ^18||^19`); `pnpm build` + `pnpm typecheck` all green

**Phase 5 — Observability + DX**

- `src/types/app.types.ts` — `AppBindings { Variables: { logger } }`, `AppOpenAPI`, `AppHandler`, `AppContext`
- `src/middlewares/pino-logger.ts` — `hono-pino` with picocolors dev destination (no pino-pretty thread issues)
- `src/middlewares/rate-limit.ts` — zero-dep in-memory rate limiter; 5/min sign-up, 10/min sign-in
- `src/lib/configure-openapi.ts` — OpenAPI 3.1 spec at `/api/doc`, Scalar UI at `/api/reference`
- `src/lib/create-app.ts` — generic over `AppBindings`; wires pino; `{ error, message }` error envelope
- All 6 route files annotated with `describeRoute` (tags, summary, description, responses)
- `tsconfig.json` paths: added `middlewares/*` and `types/*`

### Key gotchas

- `Avatar` from DS is a compound namespace — use `AvatarDS` for simple usage
- `Text` component: `color` only accepts semantic names (`"muted"` not `"fg.muted"`); no `textStyle`/`fontWeight` props
- `Button`: no `asChild`; use styled `<Link>` for nav CTAs
- Root `oxlint.config.ts` doesn't enable `react-perf` — unused disable directives fail lint
- `sqliteBooleanField()` returns `0|1`; Drizzle `.set()` expects `boolean` — bridge with `normalisePatch()`
- pino-pretty uses worker threads and can crash; use a custom picocolors destination instead

### Uncommitted at session end

Phase 5 files: types/app.types.ts, middlewares/pino-logger.ts, middlewares/rate-limit.ts,
lib/configure-openapi.ts, lib/create-app.ts (updated), all route files (describeRoute added),
tsconfig.json (paths), docs/todo/NEXT_STEPS.md, docs/todo/ROADMAP.md, package.json
