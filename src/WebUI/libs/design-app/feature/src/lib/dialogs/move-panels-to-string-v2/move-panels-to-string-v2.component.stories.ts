import { MovePanelsToStringV2Component } from './move-panels-to-string-v2.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'MovePanelsToStringV2Component',
	component: MovePanelsToStringV2Component,
} as Meta<MovePanelsToStringV2Component>

export const Primary = {
	render: (args: MovePanelsToStringV2Component) => ({
		props: args,
	}),
	args: {},
}
