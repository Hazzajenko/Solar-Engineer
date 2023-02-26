import { GroupChatMessageModel } from '@shared/data-access/models'

export interface RemoveFromGroupChatResponse {
  removedMembers: number[]
  updatedMessages: GroupChatMessageModel[]
}
