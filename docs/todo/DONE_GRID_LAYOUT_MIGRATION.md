# DONE — Migrate Tailwind Layouts to `@workspace/ui` Grid

> **Completed:** 2026-07-14. Converted page/section Tailwind multi-column layouts in `apps/client`
> to `Container` / `Row` / `Col` from `@workspace/ui/components/grid`. Micro-alignment, shadcn
> internals, app chrome, and `packages/ui/src/components/elements/**` remain as-is.

📅 2026-07-14

## Goal

Make multi-column and responsive page layouts consistent across `apps/client` by using the shared
12-column flexbox grid in `@workspace/ui`, instead of one-off Tailwind layout classes.

Reference:

- Canonical docs: [`packages/ui/src/components/grid/grid.md`](../../packages/ui/src/components/grid/grid.md)
- Agent rule: [`.agents/instructions/project/components-grid.instructions.md`](../../.agents/instructions/project/components-grid.instructions.md)

## Non-goals (left as-is)

| Leave as-is                                                                             | Why                             |
| --------------------------------------------------------------------------------------- | ------------------------------- |
| shadcn / `@workspace/ui` primitives                                                     | Upstream component chrome       |
| Icon rows, badge chips, inline label+control pairs                                      | Micro-alignment                 |
| `Layout` / `AdminLayout` shell flex                                                     | App chrome                      |
| `packages/ui/src/components/elements/**`                                                | Deferred demo widgets           |
| Login / translations / users field stacks (`grid gap-*` single-column, flex micro rows) | Not multi-column page structure |

## Progress

- [x] Phase 0 — Scope lock + inventory
- [x] Phase 1 — Conventions + agent guidance
- [x] Phase 2 — High-traffic pages
- [x] Phase 3 — Forms and toolbars
- [x] Phase 4 — Remaining client pages and feature components
- [x] Phase 5 — Tables / dense UI (selective)
- [x] Phase 6 — Sweep, lint cues, graduation checklist

---

## Phase 0 — Baseline counts (2026-07-14)

| Pattern                                                            | Count         | Notes                              |
| ------------------------------------------------------------------ | ------------- | ---------------------------------- |
| Tailwind `grid-cols-*` / `sm\|md\|lg:grid-cols-*` in `apps/client` | **2** → **0** | Landing + AdminDashboard converted |
| CSS `display: grid` in client CSS modules                          | **0**         | —                                  |
| `col-span-*` Tailwind                                              | **0**         | —                                  |
| `@workspace/ui/components/grid` imports                            | **2**         | LandingPage, AdminDashboardPage    |
| `md:flex-row` / `lg:flex-row` as page layout                       | **0**         | —                                  |

### Inventory

**Converted:**

- [x] `pages/LandingPage.tsx` — feature cards → `Row` / `Col xs={12} sm={6}`
- [x] `pages/admin/AdminDashboardPage.tsx` — stat cards → `Row` / `Col xs={12} sm={4}`

**Keep (micro):**

- [x] `pages/LoginPage.tsx` — vertical form + `grid gap-1.5` field stacks
- [x] `pages/admin/AdminTranslationsPage.tsx` — flex micro rows
- [x] `pages/admin/AdminUsersPage.tsx` — DataTable + flex chips
- [x] `components/LanguageSwitcher/**` — control cluster
- [x] `layout/Layout.tsx` / `AdminLayout.tsx` — nav chrome flex

**Keep (special) / deferred:**

- [x] `packages/ui` primitives with internal `grid-cols-*`
- [x] `packages/ui/src/components/elements/**` — deferred

**Phase 3–5:** no additional multi-column form/toolbar/table wrappers found to convert.

---

## Phase 1 — Conventions shipped

- [x] Rewrote `packages/ui/src/components/grid/grid.md` for `@workspace/ui` (no `docs/components/grid.md`)
- [x] Added `.agents/instructions/project/components-grid.instructions.md`
- [x] Linked from `AGENTS.md` project-specific rules

## Allowlist (intentional non–12-col layout)

| File / area                         | Pattern                | Why kept                   |
| ----------------------------------- | ---------------------- | -------------------------- |
| `packages/ui/**` primitives         | upstream `grid-cols-*` | Out of scope               |
| `packages/ui/.../elements/**`       | demo widget grids      | Deferred                   |
| `layout/Layout.tsx` / `AdminLayout` | shell flex             | App chrome                 |
| `LoginPage` field stacks            | `grid gap-1.5`         | Single-column micro stacks |

## Open questions (decided)

- **`packages/ui/elements/**`** — deferred
- **Canonical docs** — package `grid.md` only
- **oxlint `grid-cols-` restriction** — deferred (allowlist small enough; revisit if drift returns)
