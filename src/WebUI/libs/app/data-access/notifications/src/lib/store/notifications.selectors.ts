import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  NOTIFICATIONS_FEATURE_KEY,
  notificationsAdapter,
  NotificationsState,
} from './notifications.reducer'

export const selectNotificationsState =
  createFeatureSelector<NotificationsState>(NOTIFICATIONS_FEATURE_KEY)

const { selectAll } = notificationsAdapter.getSelectors()

export const selectNotificationsLoaded = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.loaded,
)

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.error,
)

export const selectAllNotifications = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => selectAll(state),
)
