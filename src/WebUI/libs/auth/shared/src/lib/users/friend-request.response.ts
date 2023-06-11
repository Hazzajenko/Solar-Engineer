export const FRIEND_REQUEST_EVENT = {
	SENT: 'FRIEND_REQUEST_SENT',
	ACCEPTED: 'FRIEND_REQUEST_ACCEPTED',
	REJECTED: 'FRIEND_REQUEST_REJECTED',
} as const

export type FriendRequestEvent = (typeof FRIEND_REQUEST_EVENT)[keyof typeof FRIEND_REQUEST_EVENT]

export type FriendRequestResponse = {
	fromAppUserId: string
	fromAppUserUsername: string
	event: FriendRequestEvent
}
