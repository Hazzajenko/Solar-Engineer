module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['svelte3', '@typescript-eslint'],
  env: {
    browser: true,
    node: true,
  },
  // extends: ['../../.eslintrc.json'],
  extends: [
    // then, enable whichever type-aware rules you want to use
    '../../.eslintrc.json',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  ignorePatterns: ['!**/*', 'vitest.config.ts'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
    {
      files: ['*.ts', '*.js'],
      parserOptions: {
        project: ['apps/svelte-design-app/tsconfig.*?.json'],
      },
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
  settings: {
    'svelte3/typescript': require('typescript'),
  },
}
