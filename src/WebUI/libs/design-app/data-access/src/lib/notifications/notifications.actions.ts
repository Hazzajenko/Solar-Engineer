import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ActionNotificationModel } from './action-notification'

export const NotificationsActions = createActionGroup({
	source: 'Notifications Store',
	events: {
		addNotification: props<{
			notification: ActionNotificationModel
		}>(),
		addManyNotifications: props<{
			notifications: ActionNotificationModel[]
		}>(),
		updateNotification: props<{
			update: UpdateStr<ActionNotificationModel>
		}>(),
		updateManyNotifications: props<{
			updates: UpdateStr<ActionNotificationModel>[]
		}>(),
		deleteNotification: props<{
			notificationId: string
		}>(),
		deleteManyNotifications: props<{
			notificationIds: string[]
		}>(),
		clearNotificationsState: emptyProps(),
	},
})
