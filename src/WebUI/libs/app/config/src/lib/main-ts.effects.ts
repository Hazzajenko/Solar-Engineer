import { ConnectionsEffects } from '@app/data-access/connections'
import { MessagesEffects, UserMessagesEffects } from '@app/data-access/messages'
import { UsersEffects } from '@app/data-access/users'
import { AuthEffects } from '@auth/data-access'
import { ProjectsEffects } from '@projects/data-access'


export const mainTsEffects = [
  AuthEffects,
  ConnectionsEffects,
  ProjectsEffects,
  MessagesEffects,
  UserMessagesEffects,
  UsersEffects,
  // FreePanelsEffects,
]