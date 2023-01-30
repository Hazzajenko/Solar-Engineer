import { GroupChatMemberModel } from './group-chat-member.model'
import { GroupChatMessageModel } from './group-chat-message.model'
import { GroupChatMessageMemberModel } from './group-chat-message-member.model'
import { PermissionsModel } from './group-chat.model'

export interface GroupChatCombinedModel {
  id: number
  name: string
  photoUrl: string
  permissions: PermissionsModel
  latestSentMessageTime: string
  latestSentMessage: GroupChatMessageModel
  members: GroupChatMemberModel[]
  messages: GroupChatMessageMemberModel[]
}
