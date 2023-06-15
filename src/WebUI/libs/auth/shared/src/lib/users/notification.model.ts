import { ProjectId } from '@entities/shared'
import { z } from 'zod'

export type NotificationModel = {
	id: string
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
	completed: boolean
}

export const NOTIFICATION_MODEL_SCHEMA = z.object({
	id: z.string(),
	senderAppUserId: z.string(),
	senderAppUserUserName: z.string(),
	senderAppUserPhotoUrl: z.string(),
	senderAppUserDisplayName: z.string(),
	notificationType: z.string(),
	createdTime: z.string(),
	receivedByAppUser: z.boolean(),
	seenByAppUser: z.boolean(),
	deletedByAppUser: z.boolean(),
	cancelledBySender: z.boolean(),
	completed: z.boolean(),
})

export type NotificationWithProjectInvite = NotificationModel & {
	projectInvite: ProjectInvite
	projectId: ProjectId
}

export type ProjectInvite = {
	projectId: string
	projectName: string
	projectPhotoUrl: string
}

export const NOTIFICATION_TYPE = {
	FRIEND_REQUEST_RECEIVED: 'FriendRequestReceived',
	FRIEND_REQUEST_ACCEPTED: 'FriendRequestAccepted',
	PROJECT_INVITE_RECEIVED: 'ProjectInviteReceived',
	PROJECT_INVITE_ACCEPTED: 'ProjectInviteAccepted',
	MESSAGE_RECEIVED: 'MessageReceived',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

export type LocalNotificationModel = {
	id: string
	senderAppUserId: string
	senderAppUserUserName: string
	senderAppUserPhotoUrl: string
	senderAppUserDisplayName: string
	notificationType: LocalNotificationType
	completed: boolean
}

export const LOCAL_NOTIFICATION_TYPE = {
	USER_IS_ONLINE: 'UserIsOnline',
	USER_IS_OFFLINE: 'UserIsOffline',
	GET_ONLINE_USERS: 'GetOnlineUsers',
	GET_ONLINE_FRIENDS: 'GetOnlineFriends',
} as const

export type LocalNotificationType =
	(typeof LOCAL_NOTIFICATION_TYPE)[keyof typeof LOCAL_NOTIFICATION_TYPE]
