import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { EntityUpdate } from '@shared/data-access/models'
import { DynamicNotificationModel, LocalNotificationModel, NotificationModel } from '@auth/shared'

export const NotificationsActions = createActionGroup({
	source: 'Notifications Store',
	events: {
		'Mark Notifications As Completed': props<{
			notificationIds: string[]
		}>(),
		'Mark Many Notifications As Read': props<{
			notificationIds: string[]
		}>(),
		'Load Notifications': props<{
			notifications: NotificationModel[]
		}>(),
		'Add Dynamic Notification': props<{
			dynamicNotification: DynamicNotificationModel
		}>(),
		'Delete Dynamic Notification': props<{
			dynamicNotificationId: DynamicNotificationModel['id']
		}>(),
		'Add Local Notification': props<{
			localNotification: LocalNotificationModel
		}>(),
		'Delete Local Notification': props<{
			localNotificationId: LocalNotificationModel['id']
		}>(),
		'Add Notification': props<{
			notification: NotificationModel
		}>(),
		'Add Many Notifications': props<{
			notifications: NotificationModel[]
		}>(),
		'Update Notification': props<{
			update: UpdateStr<NotificationModel>
		}>(),
		'Update Many Notifications': props<{
			updates: UpdateStr<NotificationModel>[]
		}>(),
		'Update Many Notifications With String': props<{
			updates: EntityUpdate<NotificationModel>[]
		}>(),
		'Delete Notification': props<{
			notificationId: NotificationModel['id']
		}>(),
		'Delete Many Notifications': props<{
			notificationIds: NotificationModel['id'][]
		}>(),
		'Clear Notifications State': emptyProps(),
		Noop: emptyProps(),
	},
})
