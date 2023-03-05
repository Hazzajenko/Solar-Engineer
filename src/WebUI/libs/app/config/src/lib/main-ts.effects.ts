// import { FriendsEffects } from '@app/data-access/friends'
import {
  GroupChatsEffects,
  MessagesEffects,
  // MessagesEffectsModel,
  UserMessagesEffects,
} from '@app/data-access/messages'
import { AuthEffects } from '@auth/data-access'
import { ProjectsEffects } from '@projects/data-access'
// import { NotificationsEffects } from '@app/data-access/notifications'
import { ConnectionsEffects } from '@app/data-access/connections'
import { UsersEffects } from '@app/data-access/users'

export const mainTsEffects = [
  AuthEffects,
  ConnectionsEffects,
  ProjectsEffects,
  // NotificationsEffects,
  // FriendsEffects,
  // UserMessagesEffects,
  // GroupChatsEffects,
  // ...MessagesEffectsModel,
  MessagesEffects,
  UserMessagesEffects,
  // GroupChatsEffects,
  UsersEffects,
]
