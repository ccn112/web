import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@x/shared-types': new URL('../shared-types/src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
