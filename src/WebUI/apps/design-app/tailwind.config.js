const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind')
const { join } = require('path')
const sharedTailwindConfig = require('conf/tailwind.config')

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
}
