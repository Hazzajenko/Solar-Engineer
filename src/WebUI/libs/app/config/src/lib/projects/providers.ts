import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import {
  BLOCKS_FEATURE_KEY,
  blocksReducer,
  ENTITIES_FEATURE_KEY,
  entitiesReducer,
  GRID_FEATURE_KEY,
  gridReducer,
  LINKS_FEATURE_KEY,
  LinksEffects,
  linksReducer,
  MULTI_FEATURE_KEY,
  multiReducer,
  PANELS_FEATURE_KEY,
  PanelsEffects,
  panelsReducer,
  PATHS_FEATURE_KEY,
  PathsEffects,
  pathsReducer,
  PROJECTS_HUB_FEATURE_KEY,
  projectsHubReducer,
  ProjectsHubsEffects,
  SELECTED_FEATURE_KEY,
  SelectedEffects,
  selectedReducer,
  STRINGS_FEATURE_KEY,
  StringsEffects,
  stringsReducer,
  UI_FEATURE_KEY,
  uiReducer,
} from '@grid-layout/data-access'
import { PROJECTS_FEATURE_KEY, ProjectsEffects, projectsReducer } from '@projects/data-access'

export const projectsProviders = [
  importProvidersFrom(MatDialogModule, MatSnackBarModule, MatSnackBarRef),
  provideState(PROJECTS_HUB_FEATURE_KEY, projectsHubReducer),
  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
  provideState(PANELS_FEATURE_KEY, panelsReducer),
  provideState(STRINGS_FEATURE_KEY, stringsReducer),
  provideState(LINKS_FEATURE_KEY, linksReducer),
  provideState(BLOCKS_FEATURE_KEY, blocksReducer),
  provideState(ENTITIES_FEATURE_KEY, entitiesReducer),
  provideState(SELECTED_FEATURE_KEY, selectedReducer),
  provideState(GRID_FEATURE_KEY, gridReducer),
  provideState(MULTI_FEATURE_KEY, multiReducer),
  provideState(UI_FEATURE_KEY, uiReducer),
  provideState(PATHS_FEATURE_KEY, pathsReducer),
  provideEffects([
    ProjectsEffects,
    PanelsEffects,
    StringsEffects,
    LinksEffects /*
    BlocksEffects,
    EntitiesEffects,*/,
    SelectedEffects,
    PathsEffects,
    ProjectsHubsEffects,
  ]),
]