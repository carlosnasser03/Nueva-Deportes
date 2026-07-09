import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/*.test.ts', 'src/__tests__/*.test.tsx'],
    testTimeout: 120000,
    setupFiles: ['./src/__tests__/helpers/vitest-setup.ts'],
    env: {
      TEST_DATABASE_URL: 'file::memory:?cache=shared',
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./test.db',
    },
    // Run tests serially to avoid port conflicts
    threads: false,
    singleThread: true,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
});
