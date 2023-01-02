import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { JwtInterceptor } from '@auth/interceptors'
import { provideEffects } from '@ngrx/effects'
import { provideRouterStore } from '@ngrx/router-store'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { metaReducers, reducers } from '@shared/data-access/store'
import { AuthEffects } from '@auth/data-access/effects'

import { AppComponent } from './app/app.component'
import { appRoutes } from '@app/routes'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      BrowserModule,
      BrowserAnimationsModule,
      BrowserAnimationsModule,
      MatSnackBarModule,
      MatSnackBarRef,
    ),
    provideStore(reducers, { metaReducers }),
    provideRouterStore(),
    provideEffects([AuthEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err))
