import { InitialGroupChatMemberModel } from '../data'

export interface GroupChatMembersAddedResponse {
	groupChatId: string
	invitedByUserId: string
	members: InitialGroupChatMemberModel[]
}
