import { Route } from '@angular/router'

export const appRoutes: Route[] = [
	{
		path: '',
		title: 'Solar Engineer',
		loadComponent: () => import('@canvas/app/feature').then((m) => m.DesignCanvasAppComponent),
	}, // {
	// 	path: 'sign-in',
	// 	loadComponent: () => import('@auth/feature').then((m) => m.SignInComponent),
	// },
	// {
	// 	path: 'sign-in-v2',
	// 	loadComponent: () => import('@auth/feature').then((m) => m.SignInV2Component),
	// },
	// {
	// 	path: 'sign-in2',
	// 	loadComponent: () => import('@auth/feature').then((m) => m.SignInCenterComponent),
	// },
	// {
	// 	path: 'sign-in3',
	// 	loadComponent: () => import('@auth/feature').then((m) => m.SignInDialog),
	// },
]
