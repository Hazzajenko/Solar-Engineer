import { DesignCanvasAppComponent } from './design-canvas-app.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'DesignCanvasAppComponent',
	component: DesignCanvasAppComponent,
} as Meta<DesignCanvasAppComponent>

export const Primary = {
	render: (args: DesignCanvasAppComponent) => ({
		props: args,
	}),
	args: {},
}
