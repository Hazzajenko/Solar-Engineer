import { GroupChatReadTime, MessageFrom } from '../groups'
import { NotificationStatus } from '../signalr'

export interface MessageModel {
  id: number
  senderDisplayName: string
  recipientDisplayName: string
  content: string
  messageReadTime: string | null
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
  status: NotificationStatus
  isUserSender: boolean
  messageFrom: MessageFrom
}
