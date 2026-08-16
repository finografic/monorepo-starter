# monorepo-starter - Handoff

## Project

`@finografic/monorepo-starter` is a full-stack TypeScript starter with a Vite/React client, Hono API server, Auth.js credentials auth, DB-backed i18n, admin surfaces, Drizzle SQLite persistence, and owned shadcn/Tailwind UI primitives.

**Current status:** starter refresh complete through branding, i18n seed updates, selective UI polish, syncpack v15, and TypeScript 7. SQLite remains the default database. PostgreSQL is deferred and tracked separately in `docs/todo/TODO_POSTGRES_MIGRATION.md`.

---

## Architecture

```text
monorepo-starter/
├── apps/
│   ├── client/          Vite 8 + React 19 + React Router v7 + Tailwind 4
│   └── server/          Hono + @hono/node-server + Drizzle ORM + Auth.js
├── config/              @workspace/config - Valibot env validation + dotenv
├── packages/
│   └── ui/              owned shadcn source components + global theme tokens
└── pnpm-workspace.yaml  declares config, packages/*, apps/*
```

- Client dev server: `http://localhost:3000`
- Server dev API: `http://localhost:4040/api`
- API reference: `http://localhost:4040/api/reference`

---

## Stack

| Layer      | Technology                                                       |
| ---------- | ---------------------------------------------------------------- |
| Runtime    | Node >=24.16.0, pnpm >=10.20.0, Turborepo                        |
| Server     | Hono, @hono/node-server, @hono/auth-js, hono-openapi             |
| Database   | better-sqlite3 13, Drizzle ORM, drizzle-valibot                  |
| Auth       | @auth/core, JWT strategy, credentials provider                   |
| Validation | Valibot                                                          |
| Client     | Vite 8, React 19, React Router v7, TanStack Query, react-i18next |
| Styling    | Tailwind 4, shadcn source components, Finografic brand tokens    |
| Logging    | hono-pino + pino                                                 |
| API Docs   | hono-openapi + @scalar/hono-api-reference                        |
| Tooling    | TypeScript 7, tsdown 0.22, oxlint, oxfmt, syncpack 15            |

---

## Current UI Notes

- `apps/client/src/layout/Layout.tsx` renders the Finografic logo and keeps `LanguageSwitcher` visible.
- `apps/client/src/pages/LandingPage.tsx` is starter-focused and intentionally excludes sample-app, deployment, and print-mode content.
- Brand assets live in `apps/client/src/assets/`.
- Global theme tokens live in `packages/ui/src/styles/globals.css`.
- Multi-column layouts in `apps/client` should use `@workspace/ui` `Container` / `Row` / `Col`.

---

## Database Decision

SQLite remains the selected default.

PostgreSQL is deferred because no current starter requirement needs multi-process production parity, networked database deployment, or a hosted environment. The migration is intentionally split into `docs/todo/TODO_POSTGRES_MIGRATION.md` so it can be started as an explicit optional track with its own rollback point, adapter/schema plan, seed-data split, local Postgres orchestration, and validation against auth, users, i18n, admin mutations, and health.

---

## Toolchain Decisions

- Graphify integration was removed; use lean-ctx for repository exploration and large outputs.
- Syncpack v15 is active via `syncpack.config.ts`; policy groups are starter-only and exclude removed Panda/design-system packages.
- TypeScript 7.0.2 is active. i18next / react-i18next now peer with `^5 || ^6 || ^7`.
- Turborepo remains the task runner. Moon/Proto was not adopted because this starter has a small package graph and no multi-app orchestration need.

---

## Validation Snapshot

Last full validation during the refresh:

- `pnpm install --frozen-lockfile`
- `pnpm syncpack:lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm lint` passed with warnings only.
- `pnpm test` ran with no package test tasks configured.
- Server dev health smoke returned `200` from `/api/health` on port `4040`.

Known warning: client build reports a chunk larger than 500 kB.

---

## Next

- Add real Vitest coverage for auth utilities, i18n resource grouping, auth routes, and i18n routes.
- Add browser automation only after choosing a test runner.
- If PostgreSQL is explicitly selected, start from `docs/todo/TODO_POSTGRES_MIGRATION.md`.
