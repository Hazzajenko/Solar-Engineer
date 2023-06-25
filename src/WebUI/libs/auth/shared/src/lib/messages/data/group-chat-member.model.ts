export interface GroupChatMemberModel {
	id: number
	groupChatId: number
	userId: number
	displayName: string
	// firstName: string
	// lastName: string
	photoUrl: string
	lastActive: string
	role: GroupChatMemberRole
	joinedAt: string
}

export const GROUP_CHAT_MEMBER_ROLE = {
	ADMIN: 'Admin',
	MEMBER: 'Member',
} as const

export type GroupChatMemberRole =
	(typeof GROUP_CHAT_MEMBER_ROLE)[keyof typeof GROUP_CHAT_MEMBER_ROLE]
