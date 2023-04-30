const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind')
const { join } = require('path')
const sharedTailwindConfig = require('../../libs/tailwind-preset/tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [sharedTailwindConfig],
	content: [
		join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
		join('libs/design-app/feature-design-canvas/src/lib/**/*.{ts,html}'),
		join('libs/design-app/feature-design-layout/src/lib/**/*.{ts,html}'),
		join('libs/design-app/feature-panel/src/lib/**/*.{ts,html}'),
		join('libs/design-app/feature/src/lib/**/*.{ts,html}'),
		join('libs/shared/ui/src/lib/**/*.{ts,html}'),
		...createGlobPatternsForDependencies(__dirname),
	],
	// important: true,
	// plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
