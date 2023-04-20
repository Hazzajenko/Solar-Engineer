/// <reference types="vitest" />
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/svelte-design-app',

  server: {
    port: 4200,
    host: 'localhost',
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    viteTsConfigPaths({
      root: '../../',
    }),
    svelte({
      // configFile: false,
      extensions: ['.svelte'],
      compilerOptions: {},
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
    // typescript({ sourceMap: !production }),
    // parser: '@typescript-eslint/parser', // add the TypeScript parser
    /*    svelte({

     // configFile: 'my-svelte.config.js',
     }),*/
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },
})