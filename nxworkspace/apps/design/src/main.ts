import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { AUTH_FEATURE_KEY, authReducer } from '@auth/data-access/store'
import { JwtInterceptor } from '@auth/interceptors'
import { provideEffects } from '@ngrx/effects'
import { provideRouterStore } from '@ngrx/router-store'
import { provideState, provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { UI_FEATURE_KEY, uiReducer } from '@project-id/data-access/store'
import { ProjectsEffects } from '@projects/data-access/effects'
import { PROJECTS_FEATURE_KEY, projectsReducer } from '@projects/data-access/store'
import { CONNECTIONS_FEATURE_KEY, connectionsReducer } from '@shared/data-access/connections'
import {
  NOTIFICATIONS_FEATURE_KEY,
  NotificationsEffects,
  notificationsReducer,
} from '@shared/data-access/notifications'
import { metaReducers, reducers } from '@shared/data-access/store'
import { AuthEffects } from '@auth/data-access/effects'
import { storeDevtoolsModule } from '@shared/config'
import { environment } from '@shared/environment'
import { ConnectionsEffects } from 'libs/shared/data-access/connections/src/lib/effects/connections.effects'

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
      MatDialogModule,
      MatSnackBarModule,
      MatSnackBarRef,
    ),
    provideStore(reducers, { metaReducers }),
    provideRouterStore(),
    provideEffects([AuthEffects, ConnectionsEffects, ProjectsEffects, NotificationsEffects]),
    provideState(AUTH_FEATURE_KEY, authReducer),
    provideState(CONNECTIONS_FEATURE_KEY, connectionsReducer),
    provideState(PROJECTS_FEATURE_KEY, projectsReducer),
    provideState(UI_FEATURE_KEY, uiReducer),
    provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
    /*    provideEffects([NotificationsEffects]),*/

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
