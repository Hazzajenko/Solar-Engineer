import { LocalNotificationModel } from '@auth/shared'
import { newGuid } from '@shared/utils'

/*
 const localNotification: LocalNotificationModel = {
 id: newGuid(),
 notificationType: 'UserIsOnline',
 completed: true,
 senderAppUserId: user.id,
 senderAppUserUserName: user.userName,
 senderAppUserDisplayName: user.displayName,
 senderAppUserPhotoUrl: user.photoUrl,
 }
 */

export const createLocalNotification = () =>
	({
		id: newGuid(),
		notificationType: 'UserIsOnline',
		completed: true, // senderAppUserId: user.id,
		// senderAppUserUserName: user.userName,
		// senderAppUserDisplayName: user.displayName,
		// senderAppUserPhotoUrl: user.photoUrl,
	} as LocalNotificationModel)
