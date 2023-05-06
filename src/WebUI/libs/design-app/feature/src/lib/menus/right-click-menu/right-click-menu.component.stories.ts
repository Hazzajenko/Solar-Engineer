import { RightClickMenuComponent } from './right-click-menu.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'RightClickMenuComponent',
	component: RightClickMenuComponent,
} as Meta<RightClickMenuComponent>

export const Primary = {
	render: (args: RightClickMenuComponent) => ({
		props: args,
	}),
	args: {},
}
