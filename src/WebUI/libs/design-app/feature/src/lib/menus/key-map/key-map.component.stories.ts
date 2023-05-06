import { KeyMapComponent } from './key-map.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'KeyMapComponent',
	component: KeyMapComponent,
} as Meta<KeyMapComponent>

export const Primary = {
	render: (args: KeyMapComponent) => ({
		props: args,
	}),
	args: {},
}
