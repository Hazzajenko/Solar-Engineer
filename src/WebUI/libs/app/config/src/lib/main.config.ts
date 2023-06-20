import { AppComponent } from './app.component'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { environment } from '@shared/environment'
import {
	ApplicationConfig,
	ErrorHandler,
	importProvidersFrom,
	makeEnvironmentProviders,
	provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { appRoutes } from './main.routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
	BrowserAnimationsModule,
	provideAnimations,
	provideNoopAnimations,
} from '@angular/platform-browser/animations'
import { provideNgrx } from './ngrx.config'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { JwtModule } from '@auth0/angular-jwt'
import { jwtInterceptor } from './interceptors'
import { onCLS, onFID, onLCP } from 'web-vitals'
import { GlobalErrorHandler } from '@app/data-access/errors'

if (!environment.production) {
	onCLS(console.log)
	onFID(console.log)
	onLCP(console.log)
}

export function initMainTs() {
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

	bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err))
}

export const appConfig: ApplicationConfig = {
	providers: [provideWebAppProviders()],
}

export function tokenGetter() {
	return localStorage.getItem('access_token')
}

function provideWebAppProviders() {
	return makeEnvironmentProviders([
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
		provideNgrx(),
		provideHttpClient(withInterceptors([jwtInterceptor()])),
		provideAnimations(),
		provideNoopAnimations(),
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
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler,
		},
	])
}
