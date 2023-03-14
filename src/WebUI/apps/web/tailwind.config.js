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
      translate: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
      },
    },
  },
  important: true,
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
