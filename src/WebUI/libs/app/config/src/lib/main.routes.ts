import { Route } from '@angular/router'

export const appRoutes: Route[] = [
	{
		path: '',
		title: 'Solar Engineer',
		loadComponent: () => import('@canvas/app/feature').then((m) => m.DesignCanvasAppComponent),
	},
]
