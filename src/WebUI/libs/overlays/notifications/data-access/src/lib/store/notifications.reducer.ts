import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ActionNotificationModel } from '../types'
import { NotificationsActions } from './notifications.actions'

export const NOTIFICATIONS_FEATURE_KEY = 'notifications'

export interface NotificationsState extends EntityState<ActionNotificationModel> {
	loaded: boolean
	error?: string | null
}

export const notificationsAdapter: EntityAdapter<ActionNotificationModel> =
	createEntityAdapter<ActionNotificationModel>({
		selectId: (notification) => notification.id,
	})

export const initialNotificationsState: NotificationsState = notificationsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialNotificationsState,
	on(NotificationsActions.addNotification, (state, { notification }) =>
		notificationsAdapter.addOne(notification, state),
	),
	on(NotificationsActions.addManyNotifications, (state, { notifications }) =>
		notificationsAdapter.addMany(notifications, state),
	),
	on(NotificationsActions.updateNotification, (state, { update }) =>
		notificationsAdapter.updateOne(update, state),
	),
	on(NotificationsActions.updateManyNotifications, (state, { updates }) =>
		notificationsAdapter.updateMany(updates, state),
	),
	on(NotificationsActions.deleteNotification, (state, { notificationId }) =>
		notificationsAdapter.removeOne(notificationId, state),
	),
	on(NotificationsActions.deleteManyNotifications, (state, { notificationIds }) =>
		notificationsAdapter.removeMany(notificationIds, state),
	),
	on(NotificationsActions.clearNotificationsState, () => initialNotificationsState),
)

export function notificationsReducer(state: NotificationsState | undefined, action: Action) {
	return reducer(state, action)
}
