import { Routes } from '@angular/router'

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./app/app.component').then((m) => m.AppComponent),
	},
]
