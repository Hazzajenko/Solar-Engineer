import { MovePanelsToStringV3Component } from './move-panels-to-string-v3.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'MovePanelsToStringV3Component',
	component: MovePanelsToStringV3Component,
} as Meta<MovePanelsToStringV3Component>

export const Primary = {
	render: (args: MovePanelsToStringV3Component) => ({
		props: args,
	}),
	args: {},
}
