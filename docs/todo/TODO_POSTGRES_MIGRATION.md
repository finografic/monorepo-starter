# TODO - PostgreSQL Migration

> **Status:** Deferred. SQLite remains the starter default.
> 📅 2026-08-16

## Goal

Move the starter from local SQLite persistence to PostgreSQL only if the project direction requires a
more production-shaped database baseline.

## Phase 1 - Decision and Rollback Point

- [ ] Confirm PostgreSQL is the selected default for the starter.
- [ ] Create a rollback commit/tag before database adapter changes.
- [ ] Decide whether SQLite support is removed or kept as a temporary compatibility path.

## Phase 2 - Dependencies and Environment

- [ ] Add PostgreSQL runtime dependencies.
- [ ] Remove SQLite-only dependencies if SQLite support is dropped.
- [ ] Add `DATABASE_URL` and PostgreSQL env validation.
- [ ] Update `.env.example`, `.env.development`, and `.env.production` structure.
- [ ] Add local PostgreSQL orchestration if needed.

## Phase 3 - Drizzle Adapter and Schema

- [ ] Replace or split the Drizzle adapter for PostgreSQL.
- [ ] Update `drizzle.config.ts` for PostgreSQL migrations.
- [ ] Review schema column types, defaults, indexes, and constraints.
- [ ] Regenerate migrations from a clean PostgreSQL target.

## Phase 4 - Seeds and Scripts

- [ ] Update seed utilities for PostgreSQL.
- [ ] Update `db:*` scripts for PostgreSQL reset/setup/studio flows.
- [ ] Remove SQLite file cleanup from database scripts.
- [ ] Validate `config/db-setup.config.ts` still matches real tables and seeds.

## Phase 5 - Validation

- [ ] Run `pnpm install --frozen-lockfile`.
- [ ] Run `pnpm syncpack:lint`.
- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm build`.
- [ ] Run `pnpm db:reset` against PostgreSQL.
- [ ] Smoke test `/api/health`.
- [ ] Smoke test auth session flow.
- [ ] Smoke test users admin mutations.
- [ ] Smoke test i18n translation loading and updates.

## Notes

- Approximate effort: medium, about 0.5-1.5 days for a direct migration.
- Complexity increases if SQLite and PostgreSQL must both remain supported.
- PostgreSQL improves production parity and hosted deployment readiness.
- SQLite keeps the starter easier to clone, reset, and run locally.
