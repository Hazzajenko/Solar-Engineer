import { SelectProjectResolver } from '@project-id/data-access/resolvers'
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
  GRID_FEATURE_KEY,
  gridReducer,
  multiReducer,
  MULTI_FEATURE_KEY,
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
      provideState(GRID_FEATURE_KEY, gridReducer),
      provideState(MULTI_FEATURE_KEY, multiReducer),
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
    resolve: { project: SelectProjectResolver },
  },
  /*  {
  BrowserAnimationsModule
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    },*/
]
