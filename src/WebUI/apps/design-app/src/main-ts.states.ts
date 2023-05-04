import {
	APP_STATE_FEATURE_KEY,
	appStateReducer,
	WINDOWS_FEATURE_KEY,
	windowsReducer,
} from '@design-app/data-access'
import { provideState } from '@ngrx/store'

export const mainTsStates = [
	provideState(APP_STATE_FEATURE_KEY, appStateReducer),
	provideState(WINDOWS_FEATURE_KEY, windowsReducer),
]
