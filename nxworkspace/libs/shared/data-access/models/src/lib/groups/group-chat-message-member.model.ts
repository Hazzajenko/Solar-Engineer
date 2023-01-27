import { GroupChatMemberModel, GroupChatReadTime } from '..'

export interface GroupChatMessageMemberModel {
  id: number
  groupChatId: number
  senderUserName: string
  sender: GroupChatMemberModel
  content: string
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
}
