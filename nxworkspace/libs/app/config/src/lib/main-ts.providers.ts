import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { FRIENDS_FEATURE_KEY, FriendsEffects, friendsReducer } from '@app/data-access/friends'
import { MESSAGES_FEATURE_KEY, MessagesEffects, messagesReducer } from '@app/messages'
import { appRoutes } from '@app/routes'
import { AuthEffects } from '@auth/data-access/effects'
import { AUTH_FEATURE_KEY, authReducer } from '@auth/data-access/store'
import { JwtInterceptor } from '@auth/interceptors'
import { provideEffects } from '@ngrx/effects'
import { provideRouterStore } from '@ngrx/router-store'
import { provideState, provideStore } from '@ngrx/store'
import { UI_FEATURE_KEY, uiReducer } from '@project-id/data-access/store'
import { ProjectsEffects } from '@projects/data-access/effects'
import { PROJECTS_FEATURE_KEY, projectsReducer } from '@projects/data-access/store'
import { storeDevtoolsModule } from '@shared/config'
import { CONNECTIONS_FEATURE_KEY, connectionsReducer } from '@shared/data-access/connections'
import {
  NOTIFICATIONS_FEATURE_KEY,
  NotificationsEffects,
  notificationsReducer,
} from '@shared/data-access/notifications'
import { metaReducers, reducers } from '@shared/data-access/store'
import { ConnectionsEffects } from '../../../../shared/data-access/connections/src/lib/effects'


export const mainTsProviders = [
  provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  importProvidersFrom(
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSnackBarRef,
  ),
  provideStore(reducers, { metaReducers }),
  provideRouterStore(),
  provideEffects([AuthEffects, ConnectionsEffects, ProjectsEffects, NotificationsEffects, FriendsEffects, MessagesEffects]),
  provideState(AUTH_FEATURE_KEY, authReducer),
  provideState(CONNECTIONS_FEATURE_KEY, connectionsReducer),
  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
  provideState(UI_FEATURE_KEY, uiReducer),
  provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
  provideState(FRIENDS_FEATURE_KEY, friendsReducer),
  provideState(MESSAGES_FEATURE_KEY, messagesReducer),
  ...storeDevtoolsModule,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  },
]
