import { ViewStringComponent } from './view-string.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'ViewStringComponent',
	component: ViewStringComponent,
} as Meta<ViewStringComponent>

export const Primary = {
	render: (args: ViewStringComponent) => ({
		props: args,
	}),
	args: {},
}
