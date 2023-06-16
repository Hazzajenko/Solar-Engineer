import * as Sentry from '@sentry/angular-ivy'
import { APP_INITIALIZER, ErrorHandler, makeEnvironmentProviders } from '@angular/core'
import { Router } from '@angular/router'

export function initSentry() {
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
}

export function provideSentry() {
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
