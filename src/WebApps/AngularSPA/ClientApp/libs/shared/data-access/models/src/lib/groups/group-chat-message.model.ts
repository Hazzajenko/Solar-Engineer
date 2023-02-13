import { MessageFrom } from './message-from.model'

export interface GroupChatMessageModel {
  id: number
  groupChatId: number
  senderDisplayName: string
  content: string
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
  // isUserSender: boolean
  // isServer: boolean
  messageFrom: MessageFrom
}

export interface GroupChatReadTime {
  id: number
  recipientDisplayName: string
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
