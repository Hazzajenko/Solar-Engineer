import {
  GroupChatMemberModel,
  GroupChatMessageMemberModel,
  GroupChatReadTime,
  MessageFrom,
  NotificationStatus,
  WebUserModel,
} from '..'

export interface MessageWebUserModel {
  id: number
  senderDisplayName: string
  recipientDisplayName: string
  sender: WebUserModel
  content: string
  messageReadTime: string | null
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
  // status: NotificationStatus
  messageFrom: MessageFrom
  // isUserSender: boolean
}

export interface CombinedMessageUserModel {
  id: number
  isGroup: boolean
  groupChatId: 0
  senderDisplayName: string
  senderInGroup: boolean
  recipientDisplayName: string
  sender: WebUserModel | GroupChatMemberModel
  content: string
  messageReadTime: string | null
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
  // status: NotificationStatus
  messageFrom: MessageFrom
  // isUserSender: boolean
}

export type TypeOfUser = WebUserModel | GroupChatMemberModel
/*

const hi : hello = {
  id: 1,
  isUserSender: true,
  messageReadTimes: [
    {

    }
  ]
}*/
