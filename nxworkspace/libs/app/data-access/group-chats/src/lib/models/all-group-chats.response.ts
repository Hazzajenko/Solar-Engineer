import { GroupChatMemberModel, GroupChatMessageModel, GroupChatModel } from '@shared/data-access/models'

export interface AllGroupChatsDataResponse {
  groupChats: GroupChatModel[]
  groupChatMembers: GroupChatMemberModel[]
  groupChatMessages: GroupChatMessageModel[]
}
