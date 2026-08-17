---
version: alpha
name: "@workspace/ui"
source-of-truth: design-system
colors:
  sidebar-ring: oklch(0.714 0.014 41.2)
  sidebar-border: oklch(0.922 0.005 34.3)
  sidebar-accent-foreground: oklch(0.214 0.009 43.1)
  sidebar-accent: oklch(0.96 0.002 17.2)
  sidebar-primary-foreground: oklch(0.985 0 0)
  sidebar-primary: oklch(0.662 0.115 211.342)
  sidebar-foreground: oklch(0.147 0.004 49.3)
  sidebar: oklch(0.986 0.002 67.8)
  chart-5: oklch(0.437 0.078 188.216)
  chart-4: oklch(0.511 0.096 186.391)
  chart-3: oklch(0.6 0.118 184.704)
  chart-2: oklch(0.704 0.14 182.503)
  chart-1: oklch(0.855 0.138 181.071)
  ring: oklch(0.662 0.115 211.342)
  input: oklch(0.922 0.005 34.3)
  border: oklch(0.922 0.005 34.3)
  destructive: oklch(0.577 0.245 27.325)
  accent-foreground: oklch(0.214 0.009 43.1)
  accent: oklch(0.96 0.002 17.2)
  muted-foreground: oklch(0.444 0.019 43.1)
  placeholder-foreground: oklch(44.4% 0.019 43.1 / 0.5)
  muted: oklch(0.96 0.002 17.2)
  secondary-foreground: oklch(0.21 0.006 285.885)
  secondary: oklch(0.967 0.001 286.375)
  primary-foreground: oklch(0.985 0 0)
  primary: oklch(0.662 0.115 211.342)
  brand-green: oklch(0.774 0.222 134.4)
  brand-green-strong: oklch(0.669 0.1941 134.61)
  brand-green-soft: oklch(0.943 0.1145 135.11)
  brand-cyan: oklch(0.662 0.115 211.342)
  brand-cyan-hover: oklch(0.596 0.103 210.279)
  brand-wordmark: oklch(0.387 0 0)
  popover-foreground: oklch(0.147 0.004 49.3)
  popover: oklch(1 0 0)
  card-foreground: oklch(0.147 0.004 49.3)
  card: oklch(1 0 0)
  foreground: oklch(0.147 0.004 49.3)
  background: oklch(1 0 0)
rounded:
  sm: 0.27rem
  md: 0.36rem
  lg: 0.45rem
  xl: 0.63rem
  2xl: 0.81rem
  3xl: 0.99rem
  4xl: 1.17rem
---

# Design System

## Overview

Design system for @workspace/ui. Describe the product personality, target audience,
and the feel the UI should evoke. (Human-owned — `genx design sync --pull` never edits prose.)

## Source of Truth

Tokens are canonical in `src/styles/globals.css` (tailwind4). This file mirrors them for agent
consumption — when they disagree, the design system wins; refresh with `genx design sync --pull`.

These tokens are the **base (light) palette**. The design system also defines a dark
palette; the DESIGN.md schema has no concept of themes, so it is not mirrored here and
stays canonical in the design system. Do not infer that only one palette exists.
