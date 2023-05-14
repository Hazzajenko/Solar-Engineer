import { AppComponent } from './app/app.component'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { appRoutes, tokenGetter } from '@app/config'
import { environment } from '@shared/environment'
import {
	importProvidersFrom,
	makeEnvironmentProviders,
	provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { provideState, provideStore } from '@ngrx/store'
import { provideRouterStore } from '@ngrx/router-store'
import {
	BrowserAnimationsModule,
	provideAnimations,
	provideNoopAnimations,
} from '@angular/platform-browser/animations'
import { provideHttpClient } from '@angular/common/http'
import { provideToastr } from 'ngx-toastr'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { JwtModule } from '@auth0/angular-jwt'
import { storeDevtoolsModule } from '@shared/config'
import { jwtInterceptorProvider } from '@auth/interceptors'
import { providePanelsFeature } from '@entities/panels/data-access'
import { provideStringsFeature } from '@entities/strings/data-access'
import { providePanelConfigsFeature } from '@entities/panel-configs/data-access'
import { providePanelLinksFeature } from '@entities/panel-links/data-access'
import { provideEffects } from '@ngrx/effects'
import { metaReducers, reducers } from '@shared/data-access/store'
import {
	APP_STATE_FEATURE_KEY,
	appStateReducer,
	renderCanvasOnStateChanges$,
} from '@canvas/app/data-access'
import { UI_FEATURE_KEY, uiReducer } from '@overlays/ui-store/data-access'
import { SELECTED_FEATURE_KEY, selectedReducer } from '@canvas/selected/data-access'
import {
	OBJECT_POSITIONING_FEATURE_KEY,
	objectPositioningReducer,
} from '@canvas/object-positioning/data-access'
import { GRAPHICS_FEATURE_KEY, graphicsReducer } from '@canvas/graphics/data-access'
import { WINDOWS_FEATURE_KEY, windowsReducer } from '@overlays/windows/data-access'
import { KEYS_FEATURE_KEY, keysReducer } from '@canvas/keys/data-access'
import {
	NOTIFICATIONS_FEATURE_KEY,
	notificationsReducer,
} from '@overlays/notifications/data-access'

if (environment.production) {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.log = () => {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.debug = () => {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.info = () => {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.warn = () => {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.error = () => {}
}

bootstrapApplication(AppComponent, {
	providers: [provideWebAppProviders()],
}).catch((err) => console.error(err))

export function provideWebAppProviders() {
	return makeEnvironmentProviders([
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes, withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/),
		provideStore(reducers, { metaReducers }),
		provideCanvasAppStores(),
		provideRouterStore(),
		provideAnimations(),
		provideNoopAnimations(),
		provideHttpClient(),
		provideToastr(),
		importProvidersFrom(
			BrowserAnimationsModule,
			BrowserModule,
			MatDialogModule,
			MatSnackBarModule,
			MatSnackBarRef,
			DatePipe,
			JwtModule.forRoot({
				config: {
					tokenGetter: tokenGetter,
				},
			}),
		),
		...storeDevtoolsModule,
		jwtInterceptorProvider,
	])
}

export function provideCanvasAppStores() {
	return makeEnvironmentProviders([
		providePanelsFeature(),
		provideStringsFeature(),
		providePanelConfigsFeature(),
		providePanelLinksFeature(),
		provideState(APP_STATE_FEATURE_KEY, appStateReducer),
		provideState(UI_FEATURE_KEY, uiReducer),
		provideState(SELECTED_FEATURE_KEY, selectedReducer),
		provideState(OBJECT_POSITIONING_FEATURE_KEY, objectPositioningReducer),
		provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
		provideState(WINDOWS_FEATURE_KEY, windowsReducer),
		provideState(KEYS_FEATURE_KEY, keysReducer),
		provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
		provideEffects({ renderCanvasOnStateChanges$ }),
	])
}
