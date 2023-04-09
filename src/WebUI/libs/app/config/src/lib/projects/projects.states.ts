import { BLOCKS_FEATURE_KEY, blocksReducer, ENTITIES_FEATURE_KEY, entitiesReducer, GRID_FEATURE_KEY, GRID_PANELS_FEATURE_KEY, GRID_SELECTED_FEATURE_KEY, gridPanelsReducer, gridReducer, gridSelectedReducer, gridStringsReducer, LINKS_FEATURE_KEY, linksReducer, MULTI_FEATURE_KEY, multiReducer, PATHS_FEATURE_KEY, pathsReducer, STRINGS_FEATURE_KEY, UI_FEATURE_KEY, uiReducer } from '@grid-layout/data-access';
import { provideState } from '@ngrx/store';
import { PROJECTS_FEATURE_KEY, projectsReducer, SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer } from '@projects/data-access';


// import { SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer } from '@app/data-access/signalr'

export const projectsStates = [
  // provideState(PROJECTS_HUB_FEATURE_KEY, projectsHubReducer),
  provideState(SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer),
  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
  provideState(GRID_PANELS_FEATURE_KEY, gridPanelsReducer),
  provideState(STRINGS_FEATURE_KEY, gridStringsReducer),
  provideState(LINKS_FEATURE_KEY, linksReducer),
  provideState(BLOCKS_FEATURE_KEY, blocksReducer),
  provideState(ENTITIES_FEATURE_KEY, entitiesReducer),
  provideState(GRID_SELECTED_FEATURE_KEY, gridSelectedReducer),
  provideState(GRID_FEATURE_KEY, gridReducer),
  provideState(MULTI_FEATURE_KEY, multiReducer),
  provideState(UI_FEATURE_KEY, uiReducer),
  provideState(PATHS_FEATURE_KEY, pathsReducer),
]