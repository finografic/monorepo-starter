import { createColorTokens } from '@finografic/design-system/palette';
import { designSystemPreset } from '@finografic/design-system/panda.preset';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: false,
  presets: ['@pandacss/dev/presets', designSystemPreset],
  include: [
    './src/**/*.{ts,tsx}',
    './node_modules/@finografic/design-system/dist/**/*.recipe.js',
    './node_modules/@finografic/design-system/src/**/*.{ts,tsx}',
  ],
  exclude: [],
  jsxFramework: 'react',
  outdir: './styled-system',
  theme: {
    ...designSystemPreset.theme,
    semanticTokens: {
      ...designSystemPreset.theme?.semanticTokens,
      colors: {
        ...designSystemPreset.theme?.semanticTokens?.colors,
        bg: {
          ...designSystemPreset.theme?.semanticTokens?.colors?.bg,
          hover: { value: { base: '{colors.grey.xlight}', _dark: '{colors.grey.xdark}' } },
        },
        danger: {
          solid: { value: { base: '{colors.danger}', _dark: '{colors.danger.light}' } },
        },
      },
    },
    extend: {
      ...designSystemPreset.theme?.extend,
      tokens: {
        ...designSystemPreset.theme?.tokens,
        colors: createColorTokens({
          primary: 'oklch(55% 0.15 250)',
          secondary: 'oklch(45% 0.1 300)',
          default: 'oklch(50% 0.01 250)',
          grey: 'oklch(55% 0.016 286)',
          text: 'oklch(17% 0.005 264)',
        }),
      },
    },
  },
  syntax: 'object-literal',
});
