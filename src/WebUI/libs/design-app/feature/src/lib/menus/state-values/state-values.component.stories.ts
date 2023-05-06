import { StateValuesComponent } from './state-values.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'StateValuesComponent',
	component: StateValuesComponent,
} as Meta<StateValuesComponent>

export const Primary = {
	render: (args: StateValuesComponent) => ({
		props: args,
	}),
	args: {},
}
