import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { FRIENDS_FEATURE_KEY, FriendsEffects, friendsReducer } from '@app/data-access/friends'
import {
  GROUP_CHAT_MEMBERS_FEATURE_KEY,
  GROUP_CHAT_MESSAGES_FEATURE_KEY,
  GROUP_CHATS_FEATURE_KEY, groupChatMembersReducer, groupChatMessagesReducer, GroupChatsEffects, groupChatsReducer,
} from '@app/data-access/group-chats'
import { MESSAGES_FEATURE_KEY, MessagesEffects, messagesReducer } from '@app/data-access/messages'
import { SignalrEffects } from '@app/data-access/signalr'
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
import { CONNECTIONS_FEATURE_KEY, ConnectionsEffects, connectionsReducer } from '@app/data-access/connections'
import {
  NOTIFICATIONS_FEATURE_KEY,

  NotificationsEffects, notificationsReducer,

} from '@app/data-access/notifications'
import { metaReducers, reducers } from '@shared/data-access/store'


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
  provideEffects([AuthEffects, ConnectionsEffects, ProjectsEffects, NotificationsEffects, FriendsEffects, MessagesEffects, GroupChatsEffects, SignalrEffects]),
  provideState(AUTH_FEATURE_KEY, authReducer),
  provideState(CONNECTIONS_FEATURE_KEY, connectionsReducer),
  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
  provideState(UI_FEATURE_KEY, uiReducer),
  provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
  provideState(FRIENDS_FEATURE_KEY, friendsReducer),
  provideState(MESSAGES_FEATURE_KEY, messagesReducer),
  provideState(GROUP_CHATS_FEATURE_KEY, groupChatsReducer),
  provideState(GROUP_CHAT_MEMBERS_FEATURE_KEY, groupChatMembersReducer),
  provideState(GROUP_CHAT_MESSAGES_FEATURE_KEY, groupChatMessagesReducer),
  ...storeDevtoolsModule,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  },
]
