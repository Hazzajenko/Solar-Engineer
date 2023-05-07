import type { StorybookConfig } from '@storybook/angular'

const config: StorybookConfig = {
	/*	webpackFinal: async (config) => {
	 config!.resolve!.plugins = [
	 ...(config!.resolve!.plugins || []),
	 new TsconfigPathsPlugin({
	 extensions: config!.resolve!.extensions,
	 }),
	 ]
	 return config
	 },*/
	stories: ['../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
	addons: ['@storybook/addon-essentials'],
	framework: {
		name: '@storybook/angular',
		options: {},
	},
	core: {
		builder: {
			name: '@storybook/builder-webpack5',
			options: {
				fsCache: true,
				lazyCompilation: true,
			},
		},
	},
}

export default config

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs