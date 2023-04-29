import { Route } from '@angular/router'

export const appRoutes: Route[] = [
	{
		path: '',
		loadComponent: () =>
			import('deprecated/design-app/feature-design-layout').then((m) => m.DesignLayoutComponent),
	},
]
