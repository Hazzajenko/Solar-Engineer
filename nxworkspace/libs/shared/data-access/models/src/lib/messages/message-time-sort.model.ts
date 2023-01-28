import { GroupChatCombinedModel } from '../groups'
import { MessageModel } from '../users'

export interface MessageTimeSortModel {
  isGroup: boolean
  chatRoomName: string
  latestSentMessageTime: string
  groupChat?: GroupChatCombinedModel
  message?: MessageModel
}
