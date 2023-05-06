import { AppComponent } from './app/app.component'
import { mainTsStates } from './main-ts.states'
import { DatePipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { appRoutes, tokenGetter } from '@app/config'
import { JwtModule } from '@auth0/angular-jwt'
import { jwtInterceptorProvider } from '@auth/interceptors'
import { provideRouterStore } from '@ngrx/router-store'
import { provideStore } from '@ngrx/store'
import { storeDevtoolsModule } from '@shared/config'
import { metaReducers, reducers } from '@shared/data-access/store'

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes, withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/),
		importProvidersFrom(
			HttpClientModule,
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
		...mainTsStates,
		...storeDevtoolsModule,
		jwtInterceptorProvider,
	],
}).catch((err) => console.error(err))
/*

 inspect({
 iframe: false,
 url: 'https://statecharts.io/inspect',
 })
 */