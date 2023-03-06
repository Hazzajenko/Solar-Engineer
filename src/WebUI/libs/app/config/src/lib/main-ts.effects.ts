import { MessagesEffects, UserMessagesEffects } from '@app/data-access/messages'
import { AuthEffects } from '@auth/data-access'
import { ProjectsEffects } from '@projects/data-access'
import { ConnectionsEffects } from '@app/data-access/connections'
import { UsersEffects } from '@app/data-access/users'

export const mainTsEffects = [
  AuthEffects,
  ConnectionsEffects,
  ProjectsEffects,
  MessagesEffects,
  UserMessagesEffects,
  UsersEffects,
]
