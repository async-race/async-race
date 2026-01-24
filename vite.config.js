/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths()],
  test: {
    watch: false,
    environment: 'jsdom',
    globals: true,
    coverage: {
      enabled: false,
      reporter: ['text'],
      include: ['src/**/*.{js,ts}'],
      exclude: [
        'src/**/*.test.{js,ts}',
        'src/**/*.d.ts',
        'src/**/*types.ts',
        'src/shared/test/mock.ts',
      ],
      thresholds: {
        global: {
          statements: 70,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  },
});
