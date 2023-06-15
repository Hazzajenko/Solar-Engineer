import { NotificationsActions } from './notifications.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { LocalNotificationModel, NotificationModel } from '@auth/shared'

export const NOTIFICATIONS_FEATURE_KEY = 'notifications'

export interface NotificationsState extends EntityState<NotificationModel> {
	loaded: boolean
	localNotifications: LocalNotificationModel[]
	error?: string | null
}

const sortByCreatedAtDesc = (a: NotificationModel, b: NotificationModel) =>
	new Date(b.createdTime) > new Date(a.createdTime) ? -1 : 1

export const notificationsAdapter: EntityAdapter<NotificationModel> =
	createEntityAdapter<NotificationModel>({
		selectId: (string) => string.id,
		sortComparer: sortByCreatedAtDesc,
	})

export const initialNotificationsState: NotificationsState = notificationsAdapter.getInitialState({
	loaded: false,
	localNotifications: [],
})

const reducer = createReducer(
	initialNotificationsState,
	on(NotificationsActions.markNotificationsAsCompleted, (state, { notificationIds }) =>
		notificationsAdapter.updateMany(
			notificationIds.map((notificationId) => ({
				id: notificationId,
				changes: {
					seenByAppUser: true,
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
	on(NotificationsActions.addLocalNotification, (state, { localNotification }) => ({
		...state,
		localNotifications: [...state.localNotifications, localNotification],
	})),
	on(NotificationsActions.deleteLocalNotification, (state, { localNotificationId }) => ({
		...state,
		localNotifications: state.localNotifications.filter(
			(localNotification) => localNotification.id !== localNotificationId,
		),
	})),
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
