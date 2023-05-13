import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { appRoutes, tokenGetter } from '@app/config'
import {
	BrowserAnimationsModule,
	provideAnimations,
	provideNoopAnimations,
} from '@angular/platform-browser/animations'
import { provideHttpClient } from '@angular/common/http'
import { provideToastr } from 'ngx-toastr'
import { BrowserModule } from '@angular/platform-browser'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { JwtModule } from '@auth0/angular-jwt'
import { provideStore } from '@ngrx/store'
import { metaReducers, reducers } from '@shared/data-access/store'
import { provideRouterStore } from '@ngrx/router-store'
import { DesignAppNgrxStores } from '@design-app/data-access'
import { storeDevtoolsModule } from '@shared/config'
import { jwtInterceptorProvider } from '@auth/interceptors'

export const webAppProviders = [
	provideZoneChangeDetection({ eventCoalescing: true }),
	provideRouter(appRoutes, withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/),
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
	provideStore(reducers, { metaReducers }),
	provideRouterStore(),
	...DesignAppNgrxStores,
	...storeDevtoolsModule,
	jwtInterceptorProvider,
]
