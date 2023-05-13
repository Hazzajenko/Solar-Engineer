import { WindowComponent } from './window.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'WindowComponent',
	component: WindowComponent,
} as Meta<WindowComponent>

export const Primary = {
	render: (args: WindowComponent) => ({
		props: args,
	}),
	args: {
		windowId: '',
	},
}
