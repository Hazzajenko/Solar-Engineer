import { MovePanelsToStringComponent } from './move-panels-to-string.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'MovePanelsToStringComponent',
	component: MovePanelsToStringComponent,
} as Meta<MovePanelsToStringComponent>

export const Primary = {
	render: (args: MovePanelsToStringComponent) => ({
		props: args,
	}),
	args: {},
}
