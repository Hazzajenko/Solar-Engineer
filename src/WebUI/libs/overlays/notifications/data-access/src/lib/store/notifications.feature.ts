import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { NOTIFICATIONS_FEATURE_KEY, notificationsReducer } from './notifications.reducer'
import { provideEffects } from '@ngrx/effects'
import * as NotificationsEffects from './notifications.effects'

export function provideNotificationsFeature() {
	return makeEnvironmentProviders([
		provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
		provideEffects(NotificationsEffects),
	])
}
