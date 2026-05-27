import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],

  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@styled-system/styles.css': resolve('styled-system/styles.css'),
      '@styled-system/css': resolve('styled-system/css'),
      '@styled-system/jsx': resolve('styled-system/jsx'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
