import { InitialGroupChatMemberDto } from '../data/initial-group-chat-member-dto.model'

export interface GroupChatMembersAddedResponse {
	groupChatId: string
	invitedByUserId: string
	members: InitialGroupChatMemberDto[]
}
