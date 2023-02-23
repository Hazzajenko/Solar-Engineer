import { FRIENDS_FEATURE_KEY, friendsReducer } from '@app/data-access/friends'
import {
  GROUP_CHAT_MEMBERS_FEATURE_KEY,
  GROUP_CHAT_MESSAGES_FEATURE_KEY,
  GROUP_CHATS_FEATURE_KEY,
  groupChatMembersReducer,
  groupChatMessagesReducer,
  groupChatsReducer,
} from '@app/data-access/group-chats'
import { MESSAGES_FEATURE_KEY, messagesReducer } from '@app/data-access/messages'
import { AUTH_FEATURE_KEY, authReducer } from '@auth/data-access'
import { provideState } from '@ngrx/store'
import { UI_FEATURE_KEY, uiReducer } from '@project-id/data-access/store'
import { PROJECTS_FEATURE_KEY, projectsReducer } from '@projects/data-access/store'
import { CONNECTIONS_FEATURE_KEY, connectionsReducer } from '@app/data-access/connections'
import { NOTIFICATIONS_FEATURE_KEY, notificationsReducer } from '@app/data-access/notifications'
import { USERS_FEATURE_KEY, usersReducer } from '@app/data-access/users'
// import { CHAT_ROOMS_FEATURE_KEY, chatRoomsReducer } from '../../../feature/chatrooms/src/lib/store'

export const mainTsStates = [
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
  provideState(USERS_FEATURE_KEY, usersReducer),
  // provideState(CHAT_ROOMS_FEATURE_KEY, chatRoomsReducer),
]
