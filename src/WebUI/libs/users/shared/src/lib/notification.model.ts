export type NotificationModel = {
	appUserId: string
	appUserUserName: string
	notificationFromAppUserId: string
	notificationFromAppUserUserName: string
	content: string
	notificationType: string
	created: string
	seenByAppUser: boolean
	deletedByAppUser: boolean
	cancelledBySender: boolean
}
