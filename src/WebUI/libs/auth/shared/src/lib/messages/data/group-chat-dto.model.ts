import { InitialGroupChatMemberDto } from './initial-group-chat-member-dto.model'
import { GroupChatCombinedMessageDto } from './group-chat-combined-message-dto.model'

export interface GroupChatDto {
	id: string
	name: string
	photoUrl: string
	members: InitialGroupChatMemberDto[]
	latestMessage: GroupChatCombinedMessageDto | null
}
