import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { USERS_FEATURE_KEY, usersReducer } from './users.reducer'

export function provideUsersFeature() {
	return makeEnvironmentProviders([provideState(USERS_FEATURE_KEY, usersReducer)])
}
