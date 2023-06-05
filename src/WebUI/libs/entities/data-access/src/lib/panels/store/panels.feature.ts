import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { PANELS_FEATURE_KEY, panelsReducer } from './panels.reducer'
import * as panelsEffects from './panels.effects'
import * as panelsSignalrEffects from './panels.signalr.effects'

export function providePanelsFeature() {
	return makeEnvironmentProviders([
		provideState(PANELS_FEATURE_KEY, panelsReducer),
		provideEffects(panelsEffects),
		provideEffects(panelsSignalrEffects),
	])
}
