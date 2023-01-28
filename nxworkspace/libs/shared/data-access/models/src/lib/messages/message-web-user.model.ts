import { NotificationStatus, WebUserModel } from '..'

export interface MessageWebUserModel {
  id: number
  senderUserName: string
  recipientUserName: string
  sender: WebUserModel
  content: string
  messageReadTime: string | null
  messageSentTime: string
  status: NotificationStatus
  isUserSender: boolean
}
