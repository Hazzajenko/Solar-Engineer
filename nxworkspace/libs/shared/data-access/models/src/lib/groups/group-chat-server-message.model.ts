import { MessageFrom } from './message-from.model'
import { GroupChatMessageModel } from './group-chat-message.model'
import { GROUP_CHAT_SERVER_MESSAGE_MODEL } from './group-chat-member.model'

export interface GroupChatServerMessageModel {
  id: number
  groupChatId: number
  // senderUserName: string
  content: string
  messageSentTime: string
  // isUserSender: boolean
  // isServer: boolean
  messageFrom: MessageFrom
}

/*

export interface GroupChatServerMessageModelOptions {
  id: number
  groupChatId: number
  // senderUserName: string
  content: string
  messageSentTime: string
  // isUserSender: boolean
  // isServer: boolean
  messageFrom: MessageFrom
}

export class GroupChatServerMessageModel {
  id: number
  groupChatId: number
  // senderUserName: string
  content: string
  messageSentTime: string
  // isUserSender: boolean
  // isServer: boolean
  messageFrom: MessageFrom

  constructor(options: GroupChatServerMessageModelOptions) {
    this.id = options.id
    this.groupChatId = options.groupChatId
    this.content = options.content
    this.messageSentTime = options.messageSentTime
    this.messageFrom = options.messageFrom
  }

  toMessageModel(): GroupChatMessageModel {
    return GROUP_CHAT_SERVER_MESSAGE_MODEL(this)
  }
}
*/
