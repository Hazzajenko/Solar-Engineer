import {
	LOCAL_NOTIFICATION_TYPE,
	LocalNotificationModel,
	NOTIFICATION_TYPE,
	NotificationModel,
} from '@auth/shared'
import { inject, Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

export const getContentMessageBasedOnTypeWithoutDisplayName = (notification: NotificationModel) => {
	switch (notification.notificationType) {
		case NOTIFICATION_TYPE.MESSAGE_RECEIVED:
			return 'sent you a message'
		case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
			return 'sent you a friend request'
		case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
			return 'accepted your friend request'
		case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
			return 'invited you to a project'
		case NOTIFICATION_TYPE.PROJECT_INVITE_ACCEPTED:
			return 'accepted your project invite'
		default:
			throw new Error('Unknown notification type')
	}
}

@Pipe({
	name: 'getContentMessageBasedOnTypeWithoutDisplayName',
	standalone: true,
})
export class GetContentMessageBasedOnTypeWithoutDisplayNamePipe implements PipeTransform {
	transform(notification: NotificationModel): string {
		return getContentMessageBasedOnTypeWithoutDisplayName(notification)
	}
}

export const getNotificationContentMessageBasedOnType = (notification: NotificationModel) => {
	switch (notification.notificationType) {
		case NOTIFICATION_TYPE.MESSAGE_RECEIVED:
			return `${notification.senderAppUserDisplayName} sent you a message`
		case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
			return `${notification.senderAppUserDisplayName} sent you a friend request`
		case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
			return `${notification.senderAppUserDisplayName} accepted your friend request`
		case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
			return `${notification.senderAppUserDisplayName} invited you to a project`
		case NOTIFICATION_TYPE.PROJECT_INVITE_ACCEPTED:
			return `${notification.senderAppUserDisplayName} accepted your project invite`
		default:
			throw new Error('Unknown notification type')
	}
}

@Pipe({
	name: 'getNotificationContentMessageBasedOnType',
	standalone: true,
})
export class getNotificationContentMessageBasedOnTypePipe implements PipeTransform {
	transform(notification: NotificationModel) {
		return getNotificationContentMessageBasedOnType(notification)
	}
}

export const getLocalNotificationContentMessageBasedOnType = (
	notification: LocalNotificationModel,
) => {
	switch (notification.notificationType) {
		case LOCAL_NOTIFICATION_TYPE.USER_IS_ONLINE:
			return `${notification.senderAppUserDisplayName} is online`
		case LOCAL_NOTIFICATION_TYPE.USER_IS_OFFLINE:
			return `${notification.senderAppUserDisplayName} is offline`
		default:
			throw new Error('Unknown local notification type')
	}
}

export const getContentMessageHtmlBasedOnType = (notification: NotificationModel) => {
	switch (notification.notificationType) {
		case NOTIFICATION_TYPE.MESSAGE_RECEIVED:
			// language=HTML
			return `<span class='text-gray-700'>${notification.senderAppUserDisplayName}</span>
			sent you a message`
		case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
			// language=HTML
			return `<span class='text-gray-700'>${notification.senderAppUserDisplayName}</span>
			sent you a friend request`
		case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
			// language=HTML
			return `<span class='text-gray-700'>${notification.senderAppUserDisplayName}</span>
			accepted your friend request`
		case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
			// language=HTML
			return `<span class='text-gray-700'>${notification.senderAppUserDisplayName}</span>
			invited you to a project`
		case NOTIFICATION_TYPE.PROJECT_INVITE_ACCEPTED:
			// language=HTML
			return `<span class='text-gray-700'>${notification.senderAppUserDisplayName}</span>
			accepted your project invite`
		default:
			throw new Error('Unknown notification type')
	}
}

@Pipe({
	name: 'getContentMessageHtmlBasedOnType',
	standalone: true,
})
export class GetContentMessageHtmlBasedOnTypePipe implements PipeTransform {
	private _domSanitizer = inject(DomSanitizer)

	transform(notification: NotificationModel): SafeHtml {
		return this._domSanitizer.bypassSecurityTrustHtml(
			getContentMessageHtmlBasedOnType(notification),
		)
	}
}
