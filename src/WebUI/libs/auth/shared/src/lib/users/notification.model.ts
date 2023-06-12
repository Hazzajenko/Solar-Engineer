export type NotificationModel = {
	id: string
	appUserId: string
	appUserUserName: string
	senderAppUserId: string
	senderAppUserUserName: string
	senderAppUserPhotoUrl: string
	senderAppUserDisplayName: string
	content: string
	notificationType: NotificationType
	createdTime: string
	receivedByAppUser: boolean
	seenByAppUser: boolean
	deletedByAppUser: boolean
	cancelledBySender: boolean
}

export const NOTIFICATION_TYPE = {
	FRIEND_REQUEST_RECEIVED: 'FriendRequestReceived',
	FRIEND_REQUEST_ACCEPTED: 'FriendRequestAccepted',
	PROJECT_INVITE_RECEIVED: 'ProjectInviteReceived',
	PROJECT_INVITE_ACCEPTED: 'ProjectInviteAccepted',
	MESSAGE_RECEIVED: 'MessageReceived',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]
