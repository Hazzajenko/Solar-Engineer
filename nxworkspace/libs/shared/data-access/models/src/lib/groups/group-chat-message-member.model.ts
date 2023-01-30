import { GroupChatMemberModel, GroupChatReadTime, MessageFrom } from '..'

export interface GroupChatMessageMemberModel {
  id: number
  groupChatId: number
  senderUserName: string
  sender: GroupChatMemberModel
  content: string
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
  // isUserSender: boolean
  // isServer: boolean
  messageFrom: MessageFrom
}
