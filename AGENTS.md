# AGENTS.md — AI Assistant Guide

## Project Memory Model

- `docs/todo/ROADMAP.md` = milestone plan, near-term tasks, and completed history.
- `.agents/handoff.md` = stable current project state.
- `.agents/memory.md` = chronological session log.

Promote durable findings from memory → handoff, priorities and follow-ups → roadmap.

Reference: [`docs/process/PROJECT_MEMORY_MODEL.md`](./docs/process/PROJECT_MEMORY_MODEL.md)

---

## Roadmap and Planning Docs

- Check `ROADMAP.md` before proposing new initiatives.
- Use `ROADMAP.md#next` for small follow-ups and manual validation.
- Keep detailed plans in `docs/todo/TODO_*.md`; graduate completed plans to `DONE_*.md`.
- Follow `.github/instructions/documentation/todo-done-docs.instructions.md`.

---

## Rules — Project-Specific

- Project-specific rules live in `.github/instructions/project/**/*.instructions.md`.
- Grid layouts: `.github/instructions/project/components-grid.instructions.md` — use
  `@workspace/ui` `Container` / `Row` / `Col` for multi-column page structure in `apps/client`
  (see `packages/ui/src/components/grid/grid.md`).
- All internal workspace packages use the `@workspace/*` scope (e.g. `@workspace/client`, `@workspace/server`, `@workspace/config`).
- External published dependencies use their real npm scope (e.g. `@finografic/project-scripts`).

## Rules — Global

Rules are canonical in `.github/instructions/` — see `README.md` there for folder structure.
Shared across Claude Code, Cursor, and GitHub Copilot.

**General**

- General baseline: `.github/instructions/general.instructions.md`

**Code**

- TypeScript patterns: `.github/instructions/code/typescript-patterns.instructions.md`
- Modern TS patterns: `.github/instructions/code/modern-typescript-patterns.instructions.md`
- Oxlint & style: `.github/instructions/code/linting-code-style.instructions.md`
- Provider/context patterns: `.github/instructions/code/provider-context-patterns.instructions.md`
- Picocolors CLI styling: `.github/instructions/code/picocolors-cli-styling.instructions.md`

**Naming**

- File naming: `.github/instructions/naming/file-naming.instructions.md`
- Variable naming: `.github/instructions/naming/variable-naming.instructions.md`

**Documentation**

- Documentation: `.github/instructions/documentation/documentation.instructions.md`
- README standards: `.github/instructions/documentation/readme-standards.instructions.md`
- Agent-facing markdown: `.github/instructions/documentation/agent-facing-markdown.instructions.md`
- Feature design specs: `.github/instructions/documentation/feature-design-specs.instructions.md`
- TODO/DONE docs: `.github/instructions/documentation/todo-done-docs.instructions.md`

**Git**

- Git policy: `.github/instructions/git/git-policy.instructions.md`

---

## Rules — Markdown Tables

- Padded pipes: one space on each side of every `|`, including the separator row.
- **Do NOT manually align column widths or pad cells to equal width.** `oxfmt` (run automatically
  by lint-staged on commit and by `pnpm format:fix`) fixes table alignment automatically. Spending
  tokens counting characters and iterating on spacing is wasted effort — write the content, let the
  formatter handle alignment.

---

## Git Policy

- Do not include `Co-Authored-By` lines in commit messages.
- `.github/instructions/git/git-policy.instructions.md` (see Commits and Releases sections)

---

## lean-ctx

Prefer lean-ctx for repository exploration and large command output:

- Run `ctx_compose` first when available to orient before focused reads/searches.
- Use `ctx_read` for file reads, `ctx_search` for code search, and `ctx_shell` for shell commands that may produce large output.
- Use raw shell output only when exact diagnostics, formatting, or command output bytes matter.
- Full local guidance: `/Users/justin/.codex/LEAN-CTX.md`.

## Cursor

- Always-on rules: `.cursor/rules/` (`alwaysApply` — entry point is `AGENTS.md`, same as `CLAUDE.md`)

---

## Learned User Preferences

- Do not create git commits unless the user explicitly asks.
- When changing typography, prepend new body fonts to the stack and keep existing fallbacks unless the user asks to remove a family entirely.
- For `@finografic/design-system`, ship prebuilt `dist/` from CI in the npm tarball; do not commit `dist/` or use postinstall build scripts.
- In this workspace, do not remove unused imports on save (`source.organizeImports: never`); sort only via `source.sortImports: explicit`. Keep `source.fixAll.oxc: explicit` for oxlint fixes without organize-imports cleanup.
- Prefer adding missing imports on save (`source.addMissingImports: explicit`) and TypeScript auto-import suggestions while typing.
- Use `:` as the segment separator in npm script names everywhere (e.g. `db:migrations:seed`, not `db.migrations.seed` or space-separated variants).
- Prefer the published `@finografic/project-scripts` from the registry; use `file:`/`link:` only when explicitly testing local project-scripts changes.
- `pnpm link` writes persistent `link:` specifiers in `package.json` and `pnpm-workspace.yaml` overrides — global unlink does not restore registry ranges.
- Only list seeds in `config/db-setup.config.ts` for schemas/tables that exist in this repo.

## Learned Workspace Facts

- This is a selective-extraction monorepo starter based on touch-monorepo; intentionally beyond bare-bones (auth, admin/CMS, Drizzle, i18n) and also a GitHub demo/portfolio piece.
- `pnpm-workspace.yaml` declares: `config`, `packages/*`, `apps/*`.
- Turbo drives `build`, `dev`, `lint`, `typecheck`, `test`, and `clean` tasks.
- `apps/client`: Vite 8 + React 19 + React Router v7 + shadcn/Tailwind 4; dev on port 3000, proxies `/api` → server. `apps/server`: Hono + @hono/node-server; `tsdown` build, `tsx watch` dev, default port 4000.
- `@workspace/config`: Valibot env validation + dotenv with root-dir auto-discovery + workspace paths; hosts `db-setup.config.ts`.
- Each app has a local `oxlint.config.ts` importing presets from `@finografic/oxc-config/oxlint`.
- Root `package.json` does NOT set `"type": "module"` — each sub-package declares its own.
- `packages/ui` contains owned shadcn source components and Tailwind 4 globals, exported as `@workspace/ui/*`.
- `packages/core` and `packages/shared` were intentionally skipped; `apps/` plus `packages/ui` is valid.
- No deployment workflow — GitHub Pages removed as unsuitable for full-stack monorepo.
- For selective extraction: use touch-monorepo for auth/server/db patterns; use LLAAB and vite-monorepo for shadcn/Tailwind UI package patterns.
- Root `db:reset` chains drop → migrate → `db:setup` via the `@finografic/project-scripts` `db-setup` CLI (`NODE_OPTIONS='--import tsx' db-setup -y`); do not duplicate a local db-setup script.
- `config/db-setup.config.ts` seeds: `user`, `supported_languages`, `translations_ui`, `translations_app`, `translations_admin`; `viewConfigs` is empty (no SQL views). Seed files use underscore names matching schema exports.

---
