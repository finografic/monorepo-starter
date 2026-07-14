---
description: Use @workspace/ui Container/Row/Col for multi-column page layouts in apps/client
---

# Grid layout (`@workspace/ui`)

## When to use

For **page/section structure** in `apps/client` — card bands, form field columns, toolbars,
main+aside splits — use the shared 12-column flexbox grid:

```tsx
import { Row, Col, Container } from '@workspace/ui/components/grid';
```

Canonical docs: `packages/ui/src/components/grid/grid.md`

## Do not use Tailwind for structure when…

- Two or more sibling regions share horizontal space and need responsive stacking
  (`sm:grid-cols-*`, `md:grid-cols-*`, side-by-side cards)

Prefer `Row` / `Col` spans (`xs` / `sm` / `md` / …) and gutters (`gutterWidth` / `nogutter`)
instead of `grid grid-cols-*` or proportional flex widths for those blocks.

## Leave as Tailwind / non-grid

- Micro-alignment (`flex items-center gap-2`, icon+label, badge chips)
- `Layout` / `AdminLayout` app chrome
- shadcn primitive internals
- `packages/ui/src/components/elements/**` demo widgets (deferred)
- True 2D CSS Grid named areas when that model is intentional

## PR checklist

- Breakpoints checked at ~375 / 768 / 1024 / 1280
- No double gutters (`Row` gutter + stacked `gap-*` on the same row)
- No `ds-*` or `@finografic/design-system` grid imports
- Visual styling stays in Tailwind; only **structure** moves to `Row` / `Col`
