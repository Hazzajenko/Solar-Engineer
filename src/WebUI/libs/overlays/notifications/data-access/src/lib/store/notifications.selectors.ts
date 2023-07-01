import {
	NOTIFICATIONS_FEATURE_KEY,
	notificationsAdapter,
	NotificationsState,
} from './notifications.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { NotificationModel } from '@auth/shared'

export const selectNotificationsState =
	createFeatureSelector<NotificationsState>(NOTIFICATIONS_FEATURE_KEY)

const { selectAll, selectEntities } = notificationsAdapter.getSelectors()

export const selectAllNotifications = createSelector(
	selectNotificationsState,
	(state: NotificationsState) => selectAll(state),
)

export const selectNotificationsEntities = createSelector(
	selectNotificationsState,
	(state: NotificationsState) => selectEntities(state),
)

export const selectNotificationById = (props: { id: string }) =>
	createSelector(
		selectNotificationsEntities,
		(notifications: Dictionary<NotificationModel>) => notifications[props.id],
	)

export const selectAmountOfNotifications = createSelector(
	selectAllNotifications,
	(notifications: NotificationModel[]) => notifications.length,
)

export const selectAmountOfUnreadNotifications = createSelector(
	selectAllNotifications,
	(notifications: NotificationModel[]) =>
		notifications.filter((notification) => !notification.seenByAppUser).length,
)

export const selectNotificationsThatUserHasNotReceived = createSelector(
	selectAllNotifications,
	(notifications: NotificationModel[]) =>
		notifications.filter((notification) => !notification.receivedByAppUser),
)

export const selectNotCompletedNotifications = createSelector(
	selectAllNotifications,
	(notifications: NotificationModel[]) =>
		notifications.filter((notification) => !notification.completed),
)

export const selectNotCompletedNotificationsSortedByCreatedTime = createSelector(
	selectNotCompletedNotifications,
	(notifications: NotificationModel[]) =>
		notifications.sort((a, b) => (new Date(b.createdTime) > new Date(a.createdTime) ? -1 : 1)),
)

export const selectLocalNotifications = createSelector(
	selectNotificationsState,
	(state: NotificationsState) => state.localNotifications,
)

export const selectDynamicNotifications = createSelector(
	selectNotificationsState,
	(state: NotificationsState) => state.dynamicNotifications,
)
