import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import * as stringsEffects from './strings.effects'
import { STRINGS_FEATURE_KEY, stringsReducer } from './strings.reducer'

export function provideStringsFeature() {
	return makeEnvironmentProviders([
		provideState(STRINGS_FEATURE_KEY, stringsReducer),
		provideEffects(stringsEffects),
	])
}
