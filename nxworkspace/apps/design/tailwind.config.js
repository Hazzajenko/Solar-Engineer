const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind')
const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        lightGlowGreen: '#b6e696',
        darkPurple: '#a95ea3',
        warmRed: '#dc3a70',
        darkBlue: '#1686cd',
        white: '#FCF6F5FF',
        skyBlue: '#89ABE3FF',
      },
    },
  },
  important: true,
  plugins: [],
}
