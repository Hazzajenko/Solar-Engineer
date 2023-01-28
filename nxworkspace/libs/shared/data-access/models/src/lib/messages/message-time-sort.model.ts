import { GroupChatCombinedModel } from '../groups'
import { MessageModel } from '..'

export interface MessageTimeSortModel {
  isGroup: boolean
  chatRoomName: string
  latestSentMessageTime: string
  groupChat?: GroupChatCombinedModel
  message?: MessageModel
}
