import {
  GroupChatMemberModel,
  GroupChatMessageMemberModel,
  GroupChatReadTime,
  MessageFrom,
  MessageModel,
  MessageWebUserModel,
  NotificationStatus,
  WebUserModel,
} from '..'

export interface MessageWebUserV1Model {
  id: number
  senderUserName: string
  recipientUserName: string
  sender: WebUserModel
  content: string
  messageReadTime: string | null
  messageSentTime: string
  messageFrom: MessageFrom
}

export type TypeOfMessage = MessageWebUserModel | GroupChatMessageMemberModel
/*
export interface CombinedMessageUserModel {
  id: number
  isGroup: boolean
  groupChatId: 0
  senderUserName: string
  senderInGroup: boolean
  recipientUserName: string
  sender: WebUserModel | GroupChatMemberModel
  content: string
  messageReadTime: string | null
  messageReadTimes: GroupChatReadTime[]
  messageSentTime: string
  // status: NotificationStatus
  messageFrom: MessageFrom
  // isUserSender: boolean
}*/

/*

const hi : hello = {
  id: 1,
  isUserSender: true,
  messageReadTimes: [
    {

    }
  ]
}*/
