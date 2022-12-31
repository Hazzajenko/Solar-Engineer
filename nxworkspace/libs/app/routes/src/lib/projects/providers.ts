import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import {
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
  GRID_FEATURE_KEY,
  gridReducer,
  MULTI_FEATURE_KEY,
  multiReducer,
} from '@project-id/data-access/store'
import {
  PanelsEffects,
  StringsEffects,
  LinksEffects,
  BlocksEffects,
  EntitiesEffects,
  SelectedEffects,
} from '@project-id/data-access/effects'
import { PROJECTS_FEATURE_KEY, projectsReducer } from '@projects/data-access/store'
import { ProjectsEffects } from '@projects/data-access/effects'

export const projectsProviders = [
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
]
