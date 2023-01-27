export interface GroupChatMessageModel {
  id: number
  groupChatId: number
  senderUserName: string
  content: string
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
}

export interface GroupChatReadTime {
  id: number
  recipientUserName: string
  messageReadTime: string
}
