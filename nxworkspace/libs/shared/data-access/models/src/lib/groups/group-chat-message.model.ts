import { MessageFrom } from './message-from.model'

export interface GroupChatMessageModel {
  id: number
  groupChatId: number
  senderUserName: string
  content: string
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
  // isUserSender: boolean
  // isServer: boolean
  messageFrom: MessageFrom
}

export interface GroupChatReadTime {
  id: number
  recipientUserName: string
  messageReadTime: string
}

export interface NoIdGroupChatMessageModel {
  senderUserName: string
  content: string
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
  isUserSender: boolean
  isServer: boolean
}
