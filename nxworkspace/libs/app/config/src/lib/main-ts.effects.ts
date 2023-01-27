import { FriendsEffects } from '@app/data-access/friends'
import { GroupChatsEffects } from '@app/data-access/group-chats'
import { MessagesEffects } from '@app/messages'
import { AuthEffects } from '@auth/data-access/effects'
import { ProjectsEffects } from '@projects/data-access/effects'
import { NotificationsEffects } from '@shared/data-access/notifications'
import { ConnectionsEffects } from '@shared/data-access/connections'
import { UsersEffects } from '@app/data-access/users'

export const mainTsEffects = [
  AuthEffects,
  ConnectionsEffects,
  ProjectsEffects,
  NotificationsEffects,
  FriendsEffects,
  MessagesEffects,
  GroupChatsEffects,
  UsersEffects,
]
