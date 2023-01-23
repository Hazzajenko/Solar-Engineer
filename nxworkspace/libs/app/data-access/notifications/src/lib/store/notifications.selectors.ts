import { createFeatureSelector, createSelector } from '@ngrx/store'
import { NotificationModel, NotificationStatus } from '@shared/data-access/models'
import { NOTIFICATIONS_FEATURE_KEY, notificationsAdapter, NotificationsState } from './notifications.reducer'

export const selectNotificationsState = createFeatureSelector<NotificationsState>(NOTIFICATIONS_FEATURE_KEY)

const { selectAll, selectEntities } = notificationsAdapter.getSelectors()

export const selectNotificationsLoaded = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.loaded,
)

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.error,
)

export const selectAllNotifications = createSelector(selectNotificationsState, (state: NotificationsState) =>
  selectAll(state),
)

export const selectNotificationsEntities = createSelector(selectNotificationsState, (state: NotificationsState) =>
  selectEntities(state),
)

export const selectUnreadNotifications = () =>
  createSelector(selectAllNotifications, (notifications: NotificationModel[]) =>
    notifications.filter((notification) => notification.status === NotificationStatus.Unread),
  )

