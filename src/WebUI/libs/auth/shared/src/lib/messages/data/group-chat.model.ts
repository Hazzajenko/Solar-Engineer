import { InitialGroupChatMemberModel } from './initial-group-chat-member.model'
import { GroupChatCombinedMessageModel } from './group-chat-combined-message.model'

export interface GroupChatModel {
	id: string
	name: string
	photoUrl: string
	members: InitialGroupChatMemberModel[]
	latestMessage: GroupChatCombinedMessageModel | null
}
