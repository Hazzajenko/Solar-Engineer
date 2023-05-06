import { AppComponent } from './app.component'
import { Meta } from '@storybook/angular'

export default {
	title: 'AppComponent',
	component: AppComponent,
} as Meta<AppComponent>

export const Primary = {
	render: (args: AppComponent) => ({
		props: args,
	}),
	args: {},
}
