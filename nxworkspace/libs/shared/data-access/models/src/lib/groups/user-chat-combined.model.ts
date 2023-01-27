import { MessageModel } from '../users'

export interface UserChatCombinedModel {
  id: number
  recipientUserName: string
  latestSentMessageTime: string
  latestSentMessage: MessageModel
  messages: MessageModel[]
}
