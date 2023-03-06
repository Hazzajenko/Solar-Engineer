import { HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { appRoutes } from './routes/app.routes'
import { jwtInterceptorProvider } from '@auth/interceptors'
import { storeDevtoolsModule } from '@shared/config'
import { mainTsStates } from './main-ts.states'
import { provideEffects } from '@ngrx/effects'
import { mainTsEffects } from './main-ts.effects'
import { provideStore } from '@ngrx/store'
import { provideRouterStore } from '@ngrx/router-store'
import { metaReducers, reducers } from '@shared/data-access/store'
import { DatePipe } from '@angular/common'

export const mainTsProviders = [
  provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  importProvidersFrom(
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSnackBarRef,
    DatePipe,
  ),
  provideStore(reducers, { metaReducers }),
  provideRouterStore(),
  provideEffects(...mainTsEffects),
  ...mainTsStates,
  ...storeDevtoolsModule,
  jwtInterceptorProvider,
]
