import { Route } from '@angular/router'
import { loggedInGuard } from '@auth/guards'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, ProjectsEffects, projectsReducer } from '@projects/data-access/store'

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    providers: [
      provideState(PROJECTS_FEATURE_KEY, projectsReducer),
      provideEffects([ProjectsEffects]),
    ],
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects.component').then((m) => m.ProjectsComponent),
    canActivate: [loggedInGuard],
    providers: [
      provideState(PROJECTS_FEATURE_KEY, projectsReducer),
      provideEffects([ProjectsEffects]),
    ],
  },
  {
    path: 'project-grid/:projectId',
    loadComponent: () => import('./projects/projects.component').then((m) => m.ProjectsComponent),
    canActivate: [loggedInGuard],
    providers: [
      provideState(PROJECTS_FEATURE_KEY, projectsReducer),
      provideEffects([ProjectsEffects]),
    ],
  },
  /*  {
  BrowserAnimationsModule
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    },*/
]
