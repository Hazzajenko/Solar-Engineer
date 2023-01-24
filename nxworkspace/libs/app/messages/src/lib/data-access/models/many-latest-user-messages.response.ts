import { MessageModel } from '@shared/data-access/models'

export interface ManyLatestUserMessagesResponse {
  messages: LatestUserMessage[]
}

export interface LatestUserMessage{
  username: string
  message: MessageModel
}