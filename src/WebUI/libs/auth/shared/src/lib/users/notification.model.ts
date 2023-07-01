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

export type LocalNotificationBase = {
	id: string
	notificationType: LocalNotificationType
}

export type UserBasedLocalNotification = LocalNotificationBase & {
	senderAppUserId: string
	senderAppUserUserName: string
	senderAppUserPhotoUrl: string
	senderAppUserDisplayName: string
}

export type LocalNotification__UserIsOnline = UserBasedLocalNotification & {
	notificationType: typeof LOCAL_NOTIFICATION_TYPE.USER_IS_ONLINE
}

export type LocalNotification__UserIsOffline = UserBasedLocalNotification & {
	notificationType: typeof LOCAL_NOTIFICATION_TYPE.USER_IS_OFFLINE
}

export type LocalNotification__UserStatusChanged =
	| LocalNotification__UserIsOnline
	| LocalNotification__UserIsOffline

export type LocalNotification__SelectedProject = LocalNotificationBase & {
	notificationType: typeof LOCAL_NOTIFICATION_TYPE.SELECTED_PROJECT
	projectId: string
	projectName: string
}

export type LocalNotification__LoadedTemplate = LocalNotificationBase & {
	notificationType: typeof LOCAL_NOTIFICATION_TYPE.LOADED_TEMPLATE
	templateName: string
	templatePhotoUrl: string
}

export type LocalNotification__LoadedLocalSave = LocalNotificationBase & {
	notificationType: typeof LOCAL_NOTIFICATION_TYPE.LOADED_LOCAL_SAVE
	localSaveLastModified: string
}

export type LocalNotificationModel =
	| LocalNotification__UserStatusChanged
	| LocalNotification__SelectedProject
	| LocalNotification__LoadedTemplate
	| LocalNotification__LoadedLocalSave

export const LOCAL_NOTIFICATION_TYPE = {
	USER_IS_ONLINE: 'UserIsOnline',
	USER_IS_OFFLINE: 'UserIsOffline',
	SELECTED_PROJECT: 'SelectedProject',
	LOADED_TEMPLATE: 'LoadedTemplate',
	LOADED_LOCAL_SAVE: 'LoadedLocalSave',
} as const

export type LocalNotificationType =
	(typeof LOCAL_NOTIFICATION_TYPE)[keyof typeof LOCAL_NOTIFICATION_TYPE]
