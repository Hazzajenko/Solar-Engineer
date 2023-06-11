import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { USERS_FEATURE_KEY, usersReducer } from './users.reducer'
import { provideEffects } from '@ngrx/effects'
import * as UsersEffects from './users.effects'

export function provideUsersFeature() {
	return makeEnvironmentProviders([
		provideState(USERS_FEATURE_KEY, usersReducer),
		provideEffects(UsersEffects),
	])
}
