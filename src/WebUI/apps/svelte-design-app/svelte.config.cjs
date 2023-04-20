const sveltePreprocess = require('svelte-preprocess')

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  parser: '@typescript-eslint/parser', // add the TypeScript parser

  preprocess: sveltePreprocess(),
  plugins: [
    'svelte3',
    '@typescript-eslint', // add the TypeScript plugin
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    // 'svelte3/typescript': () => require('typescript'), // pass the TypeScript package to the Svelte plugin
    // OR
    'svelte3/typescript': true, // load TypeScript as peer dependency
    // ...
  },

}
