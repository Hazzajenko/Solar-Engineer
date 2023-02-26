import { FriendsEffects } from '@app/data-access/friends'
import { GroupChatsEffects } from '@app/data-access/group-chats'
import { UserMessagesEffects } from '@app/data-access/messages'
import { AuthEffects } from '@auth/data-access'
import { ProjectsEffects } from '@projects/data-access/effects'
import { NotificationsEffects } from '@app/data-access/notifications'
import { ConnectionsEffects } from '@app/data-access/connections'
import { UsersEffects } from '@app/data-access/users'

export const mainTsEffects = [
  AuthEffects,
  ConnectionsEffects,
  ProjectsEffects,
  NotificationsEffects,
  FriendsEffects,
  UserMessagesEffects,
  GroupChatsEffects,
  UsersEffects,
]
