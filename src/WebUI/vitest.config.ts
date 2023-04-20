import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'svelte',
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
  },
})