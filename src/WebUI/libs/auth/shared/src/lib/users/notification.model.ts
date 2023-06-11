export type NotificationModel = {
	id: string
	appUserId: string
	appUserUserName: string
	senderAppUserId: string
	senderAppUserUserName: string
	senderAppUserPhotoUrl: string
	content: string
	notificationType: string
	created: string
	seenByAppUser: boolean
	deletedByAppUser: boolean
	cancelledBySender: boolean
}

// export type
// public string SenderAppUserId { get; set; } = default!;
// public string SenderAppUserUserName { get; set; } = default!;
//
