import {
	NOTIFICATIONS_FEATURE_KEY,
	notificationsAdapter,
	NotificationsState,
} from './notifications.reducer'
import { ActionNotificationModel } from '../types'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'

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
		(notifications: Dictionary<ActionNotificationModel>) => notifications[props.id],
	)
