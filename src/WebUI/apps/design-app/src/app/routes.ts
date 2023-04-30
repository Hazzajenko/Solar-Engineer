import { Route } from '@angular/router'

export const appRoutes: Route[] = [
	{
		path: '',
		loadComponent: () => import('@design-app/feature').then((m) => m.DesignCanvasAppComponent),
	},
]