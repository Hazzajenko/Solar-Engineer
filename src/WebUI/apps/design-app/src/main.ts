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

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes, withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/),
		provideAnimations(),
		provideNoopAnimations(),
		provideHttpClient(),
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
