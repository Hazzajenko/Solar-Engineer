import { GroupChatCombinedMessageDto } from '../data/group-chat-combined-message-dto.model'

export interface GetGroupChatMessagesResponse {
	groupChatMessages: GroupChatCombinedMessageDto[]
}
