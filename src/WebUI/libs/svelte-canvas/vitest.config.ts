import baseConfig from '../../vitest.config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { mergeConfig } from 'vite'

export default mergeConfig(baseConfig, {
  plugins: [svelte({ hot: !process.env['VITEST'] })],
})