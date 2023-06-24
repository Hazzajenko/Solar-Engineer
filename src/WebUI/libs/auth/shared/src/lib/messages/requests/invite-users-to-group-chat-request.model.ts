import { UserInvite } from './user-invite.model'

export interface InviteUsersToGroupChatRequest {
	groupChatId: string
	invites: UserInvite[]
}
