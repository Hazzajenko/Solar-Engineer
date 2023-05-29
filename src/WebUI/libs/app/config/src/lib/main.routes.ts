import { Route } from '@angular/router'

export const appRoutes: Route[] = [
	{
		path: '',
		loadComponent: () => import('@canvas/app/feature').then((m) => m.DesignCanvasAppComponent),
	},
]
