import { MessageModel } from '@shared/data-access/models'

export interface AllUserMessagesResponse {
  messagesWith: string
  messages: MessageModel[]
}