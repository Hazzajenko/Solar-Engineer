import { MatDialogModule } from '@angular/material/dialog'
import {
  PanelsEffects,
  StringsEffects,
  LinksEffects,
  BlocksEffects,
  EntitiesEffects,
  PANELS_FEATURE_KEY,
  panelsReducer,
  STRINGS_FEATURE_KEY,
  stringsReducer,
  LINKS_FEATURE_KEY,
  linksReducer,
  BLOCKS_FEATURE_KEY,
  blocksReducer,
  ENTITIES_FEATURE_KEY,
  entitiesReducer,
  SELECTED_FEATURE_KEY,
  selectedReducer,
  SelectedEffects,
} from '@project-id/data-access/store'
import { Route } from '@angular/router'
import { loggedInGuard } from '@auth/guards'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, ProjectsEffects, projectsReducer } from '@projects/data-access/store'
import { importProvidersFrom } from '@angular/core'

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    providers: [
      provideState(PROJECTS_FEATURE_KEY, projectsReducer),
      provideEffects([
        ProjectsEffects,
        PanelsEffects,
        StringsEffects,
        LinksEffects,
        BlocksEffects,
        EntitiesEffects,
      ]),
    ],
  },
  /*  {
      path: 'projects',
      loadComponent: () => import('./projects/projects.component').then((m) => m.ProjectsComponent),
      canActivate: [loggedInGuard],
      providers: [
        provideState(PROJECTS_FEATURE_KEY, projectsReducer),
        provideEffects([ProjectsEffects]),
      ],
    },*/
  {
    path: 'projects/:projectId',
    loadComponent: () => import('@project-id/feature/index').then((m) => m.ProjectIdComponent),
    canActivate: [loggedInGuard],
    providers: [
      importProvidersFrom(MatDialogModule),
      provideState(PROJECTS_FEATURE_KEY, projectsReducer),
      provideState(PANELS_FEATURE_KEY, panelsReducer),
      provideState(STRINGS_FEATURE_KEY, stringsReducer),
      provideState(LINKS_FEATURE_KEY, linksReducer),
      provideState(BLOCKS_FEATURE_KEY, blocksReducer),
      provideState(ENTITIES_FEATURE_KEY, entitiesReducer),
      provideState(SELECTED_FEATURE_KEY, selectedReducer),
      provideEffects([
        ProjectsEffects,
        PanelsEffects,
        StringsEffects,
        LinksEffects,
        BlocksEffects,
        EntitiesEffects,
        SelectedEffects,
      ]),
    ],
  },
  /*  {
  BrowserAnimationsModule
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    },*/
]
