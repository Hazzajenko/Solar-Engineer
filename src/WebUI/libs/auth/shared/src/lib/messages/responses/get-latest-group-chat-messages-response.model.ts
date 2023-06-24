import { GroupChatDto } from '../data/group-chat-dto.model'

export interface GetLatestGroupChatMessagesResponse {
	groupChats: GroupChatDto[]
}
