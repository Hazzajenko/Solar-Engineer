import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { appRoutes } from '@app/routes'
import {
  Auth0InterceptorProvider,
  JwtInterceptor,
  jwtInterceptorProvider,
} from '@auth/interceptors'
import { storeDevtoolsModule } from '@shared/config'
import { mainTsStates } from './main-ts.states'
import { provideEffects } from '@ngrx/effects'
import { mainTsEffects } from './main-ts.effects'
import { provideStore } from '@ngrx/store'
import { provideRouterStore } from '@ngrx/router-store'
import { metaReducers, reducers } from '@shared/data-access/store'
import { DatePipe } from '@angular/common'
// import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular'
// import { AddCookieInterceptorProvider } from '../../../../auth/interceptors/src/lib/add-cookie.interceptor'

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
    /*  AuthModule.forRoot({
        // domain: dotenv.config().parsed,
        // clientId: 'uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq',
        domain: 'dev-t8co2m74.us.auth0.com',
        clientId: 'uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq',
        /!*      authorizationParams: {
                  redirect_uri: window.location.origin,
                },*!/
        /!*
                "Domain": "https://dev-t8co2m74.us.auth0.com/",
                "Audience": "https://solarengineer.dev"
                *!/
        authorizationParams: {
          // Request this audience at user authentication time
          // audience: 'https://solarengineer.dev',
          audience: 'https://solarengineer.dev',

          // Request this scope at user authentication time
          // scope: 'read:users',
          scope: 'offline_access',
          // scope: 'read:current_user',
        },

        // Specify configuration for the interceptor
        httpInterceptor: {
          allowedList: [
            {
              // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
              uri: 'https://solarengineer.dev*',
              tokenOptions: {
                authorizationParams: {
                  // The attached token should target this audience
                  // audience: 'https://solarengineer.dev',
                  audience: 'https://solarengineer.dev',

                  // The attached token should have these scopes
                  // scope: 'read:users',
                  scope: 'read:users offline_access',
                  // scope: 'read:current_user',
                },
              },
            },
          ],
        },
        // useRefreshTokens: true,
      }),*/
  ),
  provideStore(reducers, { metaReducers }),
  provideRouterStore(),
  provideEffects(...mainTsEffects),
  ...mainTsStates,
  ...storeDevtoolsModule,
  // Auth0InterceptorProvider,
  jwtInterceptorProvider,
  // AddCookieInterceptorProvider,
  /*  {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },*/
  // { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
]
