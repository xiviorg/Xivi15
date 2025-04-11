import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './client/src/setupTests.ts',
    css: true,
    exclude: ['**/e2e/**', '**/node_modules/**'],
  },
});