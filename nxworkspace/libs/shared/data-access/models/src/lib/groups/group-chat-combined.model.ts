import {GroupChatMemberModel} from "./group-chat-member.model";
import {GroupChatMessageModel} from "./group-chat-message.model";


export interface GroupChatCombinedModel {
  id: number
  name: string
  latestSentMessageTime: string
  latestSentMessage: GroupChatMessageModel
  members: GroupChatMemberModel[]
  messages: GroupChatMessageModel[]
}