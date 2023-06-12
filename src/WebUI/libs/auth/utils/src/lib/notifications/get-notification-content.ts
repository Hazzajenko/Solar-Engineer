import { NOTIFICATION_TYPE, NotificationModel } from '@auth/shared'

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
export const getContentMessageBasedOnType = (notification: NotificationModel) => {
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
