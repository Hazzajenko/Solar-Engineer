import { mainTsEffects } from './main-ts.effects'
import { mainTsStates } from './main-ts.states'
import { appRoutes } from './routes/app.routes'
import { DatePipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { JwtModule } from '@auth0/angular-jwt'
import { jwtInterceptorProvider } from '@auth/interceptors'
import { provideEffects } from '@ngrx/effects'
import { provideRouterStore } from '@ngrx/router-store'
import { provideStore } from '@ngrx/store'
import { storeDevtoolsModule } from '@shared/config'
import { metaReducers, reducers } from '@shared/data-access/store'


export function tokenGetter() {
  return localStorage.getItem('token')
}

export const mainTsProviders = [
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
  // ...noGridLayoutProviders,
  ...storeDevtoolsModule,
  jwtInterceptorProvider,
]

// provideState(fromFreePanels.FREE_PANELS_FEATURE_KEY, fromFreePanels.freePanelsReducer),
//   provideEffects(FreePanelsEffects),