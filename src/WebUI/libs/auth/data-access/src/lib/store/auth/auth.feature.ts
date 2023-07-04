import { createFeature, provideState } from '@ngrx/store'
import { makeEnvironmentProviders } from '@angular/core'
import { provideEffects } from '@ngrx/effects'
import * as AuthEffects from './auth.effects'
import { AUTH_FEATURE_KEY, authReducer } from './auth.reducer'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const authFeature = createFeature({
	name: AUTH_FEATURE_KEY,
	reducer: authReducer,
	extraSelectors: ({
		selectAuthState,
		selectUser,
		selectGuest,
		selectError,
		selectSignInTime,
		selectInitialVisitTime,
	}) => ({
		selectAuthState,
		selectUser,
		selectGuest,
		selectError,
		selectSignInTime,
		selectInitialVisitTime,
	}),
})

export function provideAuthFeature() {
	return makeEnvironmentProviders([provideState(authFeature), provideEffects(AuthEffects)])
}
