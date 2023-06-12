import { NOTIFICATION_TYPE, NotificationModel } from '@auth/shared'
import { AppSvgKey, SvgChatBubbleLeft, SvgFolderPlus, SvgUserPlus } from '@shared/assets'
// import * as SVG_CONST from '@shared/assets'

export const getNotificationSvgNameBasedOnType = (notification: NotificationModel): AppSvgKey => {
	switch (notification.notificationType) {
		case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
			return 'SvgUserPlus'
		case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
			return 'SvgUserPlus'
		case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
			return 'SvgFolderPlus'
		case NOTIFICATION_TYPE.PROJECT_INVITE_ACCEPTED:
			return 'SvgFolderPlus'
		case NOTIFICATION_TYPE.MESSAGE_RECEIVED:
			return 'SvgChatBubbleLeft'
	}
}

export const getNotificationTypeToText = (notification: NotificationModel) => {
	switch (notification.notificationType) {
		case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
			return 'Friend Request'
		case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
			return 'Friend Request Accepted'
		case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
			return 'Project Invite Received'
		case NOTIFICATION_TYPE.PROJECT_INVITE_ACCEPTED:
			return 'Project Invite Accepted'
		case NOTIFICATION_TYPE.MESSAGE_RECEIVED:
			return 'Message Received'
	}
}

export const getNotificationSvgBasedOnType = (notification: NotificationModel) => {
	switch (notification.notificationType) {
		case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
			return SvgUserPlus.data
		case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
			return SvgUserPlus.data
		case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
			return SvgFolderPlus.data
		case NOTIFICATION_TYPE.PROJECT_INVITE_ACCEPTED:
			return SvgFolderPlus.data
		case NOTIFICATION_TYPE.MESSAGE_RECEIVED:
			return SvgChatBubbleLeft.data
	}
}
