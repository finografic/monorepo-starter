import { configOverrides, oxlintClientConfig, testOverrides } from '@finografic/oxc-config/oxlint';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export default defineConfig({
  ...oxlintClientConfig,
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
