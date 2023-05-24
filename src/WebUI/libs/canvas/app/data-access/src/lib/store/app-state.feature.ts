import { createFeature, provideState } from '@ngrx/store'
import { makeEnvironmentProviders } from '@angular/core'
import { APP_STATE_FEATURE_KEY, appStateReducer } from './app-state.reducer'

export const appStateFeature = createFeature({
	name: APP_STATE_FEATURE_KEY,
	reducer: appStateReducer,
	extraSelectors: ({
		selectAppStateState,
		selectDragBox,
		selectMode,
		selectPointer,
		selectView,
		selectPreviewAxis,
	}) => ({
		selectAppStateState,
		selectDragBox,
		selectMode,
		selectPointer,
		selectView,
		selectPreviewAxis,
	}),
})

export function provideAppStateFeature() {
	return makeEnvironmentProviders([provideState(appStateFeature)])
}
