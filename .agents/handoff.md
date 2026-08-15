# monorepo-starter - Handoff

## Project

`@finografic/monorepo-starter` is a full-stack TypeScript starter with a Vite/React client, Hono API server, Auth.js credentials auth, DB-backed i18n, admin surfaces, Drizzle SQLite persistence, and owned shadcn/Tailwind UI primitives.

**Current status:** starter refresh complete through branding, i18n seed updates, selective UI polish, syncpack v15, and TypeScript 6. SQLite remains the default database. PostgreSQL is deferred until explicitly selected.

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
| Tooling    | TypeScript 6, tsdown 0.22, oxlint, oxfmt, syncpack 15            |

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

PostgreSQL is deferred because no current starter requirement needs multi-process production parity, networked database deployment, or a hosted environment. Revisit it only as an explicit migration with a separate rollback point, adapter/schema plan, seed-data split, local Postgres orchestration, and validation against auth, users, i18n, admin mutations, and health.

---

## Toolchain Decisions

- Graphify integration was removed; use lean-ctx for repository exploration and large outputs.
- Syncpack v15 is active via `syncpack.config.ts`; policy groups are starter-only and exclude removed Panda/design-system packages.
- TypeScript 6 is active. TypeScript 7 is deferred until the i18n dependency chain peers with TS7.
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
- Revisit PostgreSQL only when explicitly selected.
