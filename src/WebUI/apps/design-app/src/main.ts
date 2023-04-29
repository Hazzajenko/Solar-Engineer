import { mainTsEffects } from '../../../libs/app/config/src/lib/main-ts.effects'
import { mainTsStates } from '../../../libs/app/config/src/lib/main-ts.states'
import { AppComponent } from './app/app.component'
import { DatePipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { appRoutes, tokenGetter } from '@app/config'
import { JwtModule } from '@auth0/angular-jwt'
import { jwtInterceptorProvider } from '@auth/interceptors'
import { provideEffects } from '@ngrx/effects'
import { provideRouterStore } from '@ngrx/router-store'
import { provideStore } from '@ngrx/store'
import { storeDevtoolsModule } from '@shared/config'
import { metaReducers, reducers } from '@shared/data-access/store'
import { inspect } from '@xstate/inspect'


bootstrapApplication(AppComponent, {
	providers: [
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
		provideEffects(...mainTsEffects),
		...mainTsStates,
		...storeDevtoolsModule,
		jwtInterceptorProvider,
	],
}).catch((err) => console.error(err))

inspect({
	iframe: false,
	url: 'https://statecharts.io/inspect',
})