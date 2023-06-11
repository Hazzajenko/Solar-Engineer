import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { NOTIFICATIONS_FEATURE_KEY, notificationsReducer } from './notifications.reducer'

export function provideNotificationsFeature() {
	return makeEnvironmentProviders([provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer)])
}
