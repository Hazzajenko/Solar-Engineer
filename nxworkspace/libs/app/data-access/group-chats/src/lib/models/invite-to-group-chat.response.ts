import { GroupChatMemberModel } from '@shared/data-access/models'

export interface InviteToGroupChatResponse {
  newMembers: GroupChatMemberModel[]
}
