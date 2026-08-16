# DONE - Monorepo Starter Update

## Summary

Completed a starter-focused refresh that strengthened the public brand, landing page, repository
workflow, translation coverage, and toolchain without adding deployment-specific behaviour or extra
sample apps.

## Completed Changes

- Replaced the project-local Graphify workflow with concise lean-ctx guidance.
- Added the Finografic logo, favicon, heading font, and brand palette.
- Refreshed the public shell while keeping the language selector visible.
- Rebuilt the landing page with starter-focused copy, auth-aware actions, and reusable grid primitives.
- Updated app/UI translation seeds for the refreshed landing page and shell controls.
- Centralised placeholder colour through a semantic UI token.
- Modernised syncpack policy with starter-only dependency groups.
- Upgraded TypeScript from 5.9 to 6 and updated compatible build/runtime dependencies.
- Kept Turborepo as the task runner.
- Deferred TypeScript 7 because the current i18n packages do not yet peer with TS7.
- Split PostgreSQL migration into its own deferred TODO and kept SQLite as the starter default.

## Validation

- `pnpm install --frozen-lockfile`
- `pnpm syncpack:lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm lint` passed with warnings only.
- `pnpm test` ran successfully; no package test tasks are currently configured.
- SQLite-backed server dev health smoke returned `200` from `/api/health`.

## Commit Checkpoints

- `3063fe5` - replace Graphify with lean-ctx
- `9358998` - refresh Finografic branding
- `386b6a7` - refresh landing translations
- `ad722b6` - refine placeholder colour tokens
- `ac4ade5` - modernise syncpack policy
- `32b19ce` - upgrade TypeScript 5.9 to 6

## Deferred

- PostgreSQL migration remains a future explicit decision tracked in
  [TODO — PostgreSQL Migration](/docs/todo/TODO_POSTGRES_MIGRATION.md).
- TypeScript 7 is now active (`7.0.2`); i18next / react-i18next peer with `^5 || ^6 || ^7`.
- Dedicated browser automation tests remain future work because this repo does not currently include a
  browser test runner.
