import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer } from './signalr-events.reducer'
import { provideEffects } from '@ngrx/effects'
import * as SignalrEventsEffects from './signalr-events.effects'

export function provideSignalrEventsFeature() {
	return makeEnvironmentProviders([
		provideState(SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer),
		provideEffects(SignalrEventsEffects),
	])
}
