import { DynamicNotificationModel, NotificationModel } from '@auth/shared'

export const NOTIFICATION_COMPONENT_TYPE = {
	SIGNALR: 'Signalr',
	LOCAL: 'Local',
} as const

export type NotificationComponentType =
	(typeof NOTIFICATION_COMPONENT_TYPE)[keyof typeof NOTIFICATION_COMPONENT_TYPE]

export type SignalrNotification = {
	componentType: typeof NOTIFICATION_COMPONENT_TYPE.SIGNALR
} & NotificationModel

export type LocalNotification = {
	componentType: typeof NOTIFICATION_COMPONENT_TYPE.LOCAL
} & DynamicNotificationModel

export type OverlayNotification = SignalrNotification | LocalNotification
