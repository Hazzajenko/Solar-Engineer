import { AppComponent } from './app.component'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { environment } from '@shared/environment'
import {
	ApplicationConfig,
	importProvidersFrom,
	makeEnvironmentProviders,
	provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { appRoutes } from './main.routes'
import { provideHttpClient } from '@angular/common/http'
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
		provideHttpClient(), // provideClientHydration(),
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
		) /*		{
		 provide: 'SocialAuthServiceConfig',
		 useValue: {
		 autoLogin: false,
		 providers: [
		 {
		 id: GoogleLoginProvider.PROVIDER_ID,
		 provider: new GoogleLoginProvider(
		 '1060507997816-fa53go38giju7jkohf046fkdhjg5rd47.apps.googleusercontent.com',
		 ),
		 },
		 ],
		 onError: (err) => {
		 console.error(err)
		 },
		 } as SocialAuthServiceConfig,
		 },*/,
	])
}
