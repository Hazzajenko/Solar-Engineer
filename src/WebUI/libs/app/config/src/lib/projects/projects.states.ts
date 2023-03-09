import { provideState } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, projectsReducer } from '@projects/data-access'
import {
  BLOCKS_FEATURE_KEY,
  blocksReducer,
  ENTITIES_FEATURE_KEY,
  entitiesReducer,
  GRID_FEATURE_KEY,
  gridReducer,
  LINKS_FEATURE_KEY,
  linksReducer,
  MULTI_FEATURE_KEY,
  multiReducer,
  PANELS_FEATURE_KEY,
  panelsReducer,
  PATHS_FEATURE_KEY,
  pathsReducer,
  SELECTED_FEATURE_KEY,
  selectedReducer,
  STRINGS_FEATURE_KEY,
  stringsReducer,
  UI_FEATURE_KEY,
  uiReducer,
} from '@grid-layout/data-access'
import { SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer } from '@app/data-access/signalr'

export const projectsStates = [
  // provideState(PROJECTS_HUB_FEATURE_KEY, projectsHubReducer),
  provideState(SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer),
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
]
