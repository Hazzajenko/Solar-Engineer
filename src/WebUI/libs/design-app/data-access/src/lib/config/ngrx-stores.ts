import { APP_STATE_FEATURE_KEY, appStateReducer } from '../app-store'
import { PANELS_FEATURE_KEY, panelsReducer, STRINGS_FEATURE_KEY, stringsReducer } from '../entities'
import { GRAPHICS_FEATURE_KEY, graphicsReducer } from '../graphics-store'
import {
	OBJECT_POSITIONING_FEATURE_KEY,
	objectPositioningReducer,
} from '../object-positioning-store'
import { SELECTED_FEATURE_KEY, selectedReducer } from '../selected'
import { WINDOWS_FEATURE_KEY, windowsReducer } from '../windows'
import { provideState } from '@ngrx/store'


export const DesignAppNgrxStores = [
	provideState(APP_STATE_FEATURE_KEY, appStateReducer),
	provideState(PANELS_FEATURE_KEY, panelsReducer),
	provideState(STRINGS_FEATURE_KEY, stringsReducer),
	provideState(SELECTED_FEATURE_KEY, selectedReducer),
	provideState(OBJECT_POSITIONING_FEATURE_KEY, objectPositioningReducer),
	provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
	provideState(WINDOWS_FEATURE_KEY, windowsReducer),
] as const