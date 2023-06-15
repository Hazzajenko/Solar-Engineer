import { AppComponent } from './app.component'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { environment } from '@shared/environment'
import {
	APP_INITIALIZER,
	ApplicationConfig,
	ErrorHandler,
	importProvidersFrom,
	makeEnvironmentProviders,
	provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter, Router, withEnabledBlockingInitialNavigation } from '@angular/router'
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

import * as Sentry from '@sentry/angular-ivy'

Sentry.init({
	dsn: 'https://efef519a47854773a599cbbede7b5055@o4505360165175296.ingest.sentry.io/4505360166813696',
	integrations: [
		new Sentry.BrowserTracing({
			// Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
			routingInstrumentation: Sentry.routingInstrumentation,
		}),
		new Sentry.Replay(),
	], // Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

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
		provideZoneChangeDetection({ eventCoalescing: true }), // provideFirebase(),
		provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
		provideNgrx(),
		provideHttpClient(withInterceptors([jwtInterceptor()])), // provideClientHydration(),
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
		provideSentry(),
	])
}

function provideSentry() {
	return makeEnvironmentProviders([
		{
			provide: ErrorHandler,
			useValue: Sentry.createErrorHandler({
				showDialog: true,
			}),
		},
		{
			provide: Sentry.TraceService,
			deps: [Router],
		},
		{
			provide: APP_INITIALIZER,
			useFactory: () => () => {},
			deps: [Sentry.TraceService],
			multi: true,
		},
	])
}
