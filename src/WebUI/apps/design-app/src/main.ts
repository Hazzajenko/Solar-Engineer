import { AppComponent } from './app/app.component'
import { DatePipe } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import {
	BrowserAnimationsModule,
	provideAnimations,
	provideNoopAnimations,
} from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { appRoutes, tokenGetter } from '@app/config'
import { JwtModule } from '@auth0/angular-jwt'
import { jwtInterceptorProvider } from '@auth/interceptors'
import { DesignAppNgrxStores } from '@design-app/data-access'
import { provideRouterStore } from '@ngrx/router-store'
import { provideStore } from '@ngrx/store'
import { storeDevtoolsModule } from '@shared/config'
import { metaReducers, reducers } from '@shared/data-access/store'
import { provideToastr } from 'ngx-toastr'
import { environment } from '@shared/environment'

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
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes, withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/),
		provideAnimations(),
		provideNoopAnimations(),
		provideHttpClient(),
		provideToastr(),
		// provideBrowser(),
		importProvidersFrom(
			// HttpClientModule,
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
		// provideEffects(...mainTsEffects),
		// ...mainTsStates,
		...DesignAppNgrxStores,
		...storeDevtoolsModule,
		jwtInterceptorProvider,
	],
}).catch((err) => console.error(err))
