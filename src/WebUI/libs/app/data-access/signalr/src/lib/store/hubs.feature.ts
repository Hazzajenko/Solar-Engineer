import { createFeature, provideState } from '@ngrx/store'
import { makeEnvironmentProviders } from '@angular/core'
import { HUBS_FEATURE_KEY, hubsReducer } from './hubs.reducer'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const hubsFeature = createFeature({
	name: HUBS_FEATURE_KEY,
	reducer: hubsReducer,
	extraSelectors: ({ selectHubsState, selectUsersHub, selectProjectsHub, selectError }) => ({
		selectHubsState,
		selectUsersHub,
		selectProjectsHub,
		selectError,
	}),
})

export function provideHubsFeature() {
	return makeEnvironmentProviders([provideState(hubsFeature)])
}
