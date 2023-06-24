import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { MESSAGES_FEATURE_KEY, messagesReducer } from './messages.reducer'
import { provideEffects } from '@ngrx/effects'
import * as MessagesEffects from './messages.effects'

export function provideMessagesFeature() {
	return makeEnvironmentProviders([
		provideState(MESSAGES_FEATURE_KEY, messagesReducer),
		provideEffects(MessagesEffects),
	])
}
