import { CanvasGraphicsMenuComponent } from './canvas-graphics-menu.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'CanvasGraphicsMenuComponent',
	component: CanvasGraphicsMenuComponent,
} as Meta<CanvasGraphicsMenuComponent>

export const Primary = {
	render: (args: CanvasGraphicsMenuComponent) => ({
		props: args,
	}),
	args: {},
}
