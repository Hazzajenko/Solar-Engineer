import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { USER_POINTS_FEATURE_KEY, userPointsReducer } from './user-points.reducer'

export function provideUserPointsFeature() {
	return makeEnvironmentProviders([provideState(USER_POINTS_FEATURE_KEY, userPointsReducer)])
}
