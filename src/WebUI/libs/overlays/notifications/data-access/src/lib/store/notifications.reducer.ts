import { NotificationsActions } from './notifications.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { NotificationModel } from '@auth/shared'

export const NOTIFICATIONS_FEATURE_KEY = 'notifications'

export interface NotificationsState extends EntityState<NotificationModel> {
	loaded: boolean
	error?: string | null
}

export const notificationsAdapter: EntityAdapter<NotificationModel> =
	createEntityAdapter<NotificationModel>({
		selectId: (string) => string.id,
	})

export const initialNotificationsState: NotificationsState = notificationsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialNotificationsState,
	on(NotificationsActions.markNotificationsAsCompleted, (state, { notificationIds }) =>
		notificationsAdapter.updateMany(
			notificationIds.map((notificationId) => ({
				id: notificationId,
				changes: {
					completed: true,
				},
			})),
			state,
		),
	),
	on(NotificationsActions.markManyNotificationsAsRead, (state, { notificationIds }) =>
		notificationsAdapter.updateMany(
			notificationIds.map((notificationId) => ({
				id: notificationId,
				changes: {
					seenByAppUser: true,
				},
			})),
			state,
		),
	),
	on(NotificationsActions.loadNotifications, (state, { notifications }) =>
		notificationsAdapter.setMany(notifications, state),
	),
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
	on(NotificationsActions.updateManyNotificationsWithString, (state, { updates }) =>
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
