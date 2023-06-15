import { makeEnvironmentProviders } from '@angular/core'
import { provideSelectedFeature } from '@canvas/selected/data-access'
import {
	provideEntityStores,
	provideProjectsFeature,
	provideSignalrEventsFeature,
} from '@entities/data-access'
import { provideAppStateFeature } from '@canvas/app/data-access'
import { provideState, provideStore } from '@ngrx/store'
import { provideUiFeature } from '@overlays/ui-store/data-access'
import { projectObjectPositioningFeature } from '@canvas/object-positioning/data-access'
import { GRAPHICS_FEATURE_KEY, graphicsReducer } from '@canvas/graphics/data-access'
import { WINDOWS_FEATURE_KEY, windowsReducer } from '@overlays/windows/data-access'
import { KEYS_FEATURE_KEY, keysReducer } from '@canvas/keys/data-access'
import { provideNotificationsFeature } from '@overlays/notifications/data-access'
import { provideRenderingEffects } from './main.effects'
import { storeDevtoolsModule } from '@shared/config'
import { metaReducers, reducers } from '@shared/data-access/store'
import { provideRouterStore } from '@ngrx/router-store'
import { provideAuthFeature, provideUsersFeature } from '@auth/data-access'
import { provideHubsFeature } from '@app/data-access/signalr'

export function provideNgrx() {
	return makeEnvironmentProviders([
		provideStore(reducers, { metaReducers }),
		provideRouterStore(),
		provideAuthFeature(),
		provideHubsFeature(),
		provideUsersFeature(),
		provideProjectsFeature(),
		provideSignalrEventsFeature(),
		provideSelectedFeature(),
		provideEntityStores(),
		provideAppStateFeature(),
		provideUiFeature(),
		projectObjectPositioningFeature(),
		provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
		provideState(WINDOWS_FEATURE_KEY, windowsReducer),
		provideState(KEYS_FEATURE_KEY, keysReducer),
		provideNotificationsFeature(),
		provideRenderingEffects(),
		...storeDevtoolsModule,
	])
}
