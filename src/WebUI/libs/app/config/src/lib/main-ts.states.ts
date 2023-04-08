import { AUTH_FEATURE_KEY, authReducer } from '@auth/data-access';
import { DESIGN_PANELS_FEATURE_KEY, designPanelsReducer } from '@design-app/feature-panel';
import { SELECTED_FEATURE_KEY, selectedReducer } from '@design-app/feature-selected';
import { provideState } from '@ngrx/store';


// import * as fromFreePanels from '../../../../no-grid-layout/feature/src/lib/state/free-panels.reducer'
// import { CHAT_ROOMS_FEATURE_KEY, chatRoomsReducer } from '../../../feature/chatrooms/src/lib/store'

export const mainTsStates = [
  /*  provideState(AUTH_FEATURE_KEY, authReducer),
   provideState(CONNECTIONS_FEATURE_KEY, connectionsReducer),
   provideState(PROJECTS_FEATURE_KEY, projectsReducer),
   provideState(UI_FEATURE_KEY, uiReducer),
   provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
   provideState(FRIENDS_FEATURE_KEY, friendsReducer),
   provideState(USER_MESSAGES_FEATURE_KEY, userMessagesReducer),
   provideState(GROUP_CHATS_FEATURE_KEY, groupChatsReducer),
   provideState(GROUP_CHAT_MEMBERS_FEATURE_KEY, groupChatMembersReducer),
   provideState(GROUP_CHAT_MESSAGES_FEATURE_KEY, groupChatMessagesReducer),
   provideState(USERS_FEATURE_KEY, usersReducer),*/
  provideState(AUTH_FEATURE_KEY, authReducer),
  provideState(DESIGN_PANELS_FEATURE_KEY, designPanelsReducer),
  provideState(SELECTED_FEATURE_KEY, selectedReducer),

  // provideState(CHAT_ROOMS_FEATURE_KEY, chatRoomsReducer),
]