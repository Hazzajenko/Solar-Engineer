import { UserInvite } from './user-invite.model'

export interface CreateGroupChatRequest {
	groupChatName: string
	invites: UserInvite[]
}
