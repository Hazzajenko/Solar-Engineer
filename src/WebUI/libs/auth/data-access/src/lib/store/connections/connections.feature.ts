import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { CONNECTIONS_FEATURE_KEY, connectionsReducer } from './connections.reducer'
import { provideEffects } from '@ngrx/effects'
import * as ConnectionsEffects from './connections.effects'

export function provideConnectionsFeature() {
	return makeEnvironmentProviders([
		provideState(CONNECTIONS_FEATURE_KEY, connectionsReducer),
		provideEffects(ConnectionsEffects),
	])
}
