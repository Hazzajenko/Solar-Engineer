import { MessageModel } from '../users'

export interface UserChatCombinedModel {
  id: number
  recipientUsername: string
  latestSentMessageTime: string
  latestSentMessage: MessageModel
  messages: MessageModel[]
}
