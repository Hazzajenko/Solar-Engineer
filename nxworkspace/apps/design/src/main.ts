import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { AUTH_FEATURE_KEY, authReducer } from '@auth/data-access/store'
import { JwtInterceptor } from '@auth/interceptors'
import { provideEffects } from '@ngrx/effects'
import { provideRouterStore } from '@ngrx/router-store'
import { provideState, provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { PROJECTS_FEATURE_KEY, projectsReducer } from '@projects/data-access/store'
import { metaReducers, reducers } from '@shared/data-access/store'
import { AuthEffects } from '@auth/data-access/effects'
import { storeDevtoolsModule } from '@shared/config'
import { environment } from '@shared/environment'

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
    provideState(AUTH_FEATURE_KEY, authReducer),
    // provideStoreDevtools({
    //   maxAge: 25,
    //   logOnly: environment.production,
    // }),
    ...storeDevtoolsModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err))
