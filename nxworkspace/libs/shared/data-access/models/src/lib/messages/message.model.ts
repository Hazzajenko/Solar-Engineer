import { NotificationStatus } from '../signalr'

export interface MessageModel {
  id: number
  senderUserName: string
  recipientUserName: string
  content: string
  messageReadTime: string | null
  messageSentTime: string
  status: NotificationStatus
  isUserSender: boolean
}
