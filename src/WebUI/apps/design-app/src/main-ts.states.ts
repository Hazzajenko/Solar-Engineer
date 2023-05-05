import {
	APP_STATE_FEATURE_KEY,
	appStateReducer,
	GRAPHICS_FEATURE_KEY,
	graphicsReducer,
	SELECTED_FEATURE_KEY,
	selectedReducer,
	WINDOWS_FEATURE_KEY,
	windowsReducer,
} from '@design-app/data-access'
import { provideState } from '@ngrx/store'

export const mainTsStates = [
	provideState(APP_STATE_FEATURE_KEY, appStateReducer),
	provideState(SELECTED_FEATURE_KEY, selectedReducer),
	provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
	provideState(WINDOWS_FEATURE_KEY, windowsReducer),
]