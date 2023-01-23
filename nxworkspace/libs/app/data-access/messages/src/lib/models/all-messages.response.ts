import { FriendModel, MessageModel } from '@shared/data-access/models'

export interface AllMessagesResponse {
  messages: MessageModel[]
}