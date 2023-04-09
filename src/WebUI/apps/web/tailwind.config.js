const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind')
const { join } = require('path')
const sharedTailwindConfig = require('../../libs/tailwind-preset/tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedTailwindConfig],
  content: [
    join(__dirname, 'src/**/*.{ts,html}'),
    join('libs/design-app/feature-design-layout/src/lib/**/*.{ts,html}'),
    join('libs/design-app/feature-panel/src/lib/**/*.{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  /*  darkMode: 'class',
    theme: {
      extend: {
        colors: {
          lightGlowGreen: '#b6e696',
          darkPurple: '#a95ea3',
          warmRed: '#dc3a70',
          darkBlue: '#1686cd',
          // white: '#FCF6F5FF',
          skyBlue: '#89ABE3FF',
          transparent: 'transparent',
          current: 'currentColor',
          white: '#ffffff',
          purple: '#3f3cbb',
          midnight: '#121063',
          metal: '#565584',
          tahiti: '#3ab7bf',
          silver: '#ecebff',
          'bubble-gum': '#ff77e9',
          bermuda: '#78dcca',
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
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],*/
}
