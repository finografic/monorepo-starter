import { configOverrides, oxlintClientConfig, testOverrides } from '@finografic/oxc-config/oxlint';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export default defineConfig({
  ...oxlintClientConfig,
  rules: {
    ...oxlintClientConfig.rules,
    // Kept local deliberately: this is a library choice, not a client-app trait. TanStack Table
    // `cell`/`header` renderers are render props invoked via flexRender, never mounted as elements,
    // so they cannot cause the remounts this rule guards against. Projects without such libraries
    // should keep the rule strict, which is why it is not in the shared preset.
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
  options: {
    ...oxlintClientConfig.options,
    // Root-only settings: oxlint rejects these in a nested config, and nested discovery is how the
    // root lint script reaches this file at all. Same workaround as packages/ui.
    typeAware: undefined,
    typeCheck: undefined,
    reportUnusedDisableDirectives: undefined,
  },
  overrides: [testOverrides, configOverrides],
} satisfies OxlintConfig);
