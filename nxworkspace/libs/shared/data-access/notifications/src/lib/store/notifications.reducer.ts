import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { NotificationModel } from '@shared/data-access/models'

import { NotificationsActions } from './notifications.actions'

export const NOTIFICATIONS_FEATURE_KEY = 'notifications'

export interface NotificationsState extends EntityState<NotificationModel> {
  loaded: boolean
  error?: string | null
}

export function selectId(a: NotificationModel): number {
  return a.id
}

export const notificationsAdapter: EntityAdapter<NotificationModel> = createEntityAdapter<NotificationModel>({
  selectId,
})

export const initialNotificationsState: NotificationsState = notificationsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialNotificationsState,
  on(NotificationsActions.initNotifications, (state) => ({ ...state, loaded: false, error: null })),
  on(NotificationsActions.addNotification, (state, { notification }) =>
    notificationsAdapter.addOne(notification, state),
  ),
  on(NotificationsActions.addManyNotifications, (state, { notifications }) =>
    notificationsAdapter.addMany(notifications, state),
  ),
  on(NotificationsActions.removeNotification, (state, { notificationId }) =>
    notificationsAdapter.removeOne(notificationId, state)),

  on(NotificationsActions.removeManyNotifications, (state, { notificationIds }) =>
    notificationsAdapter.removeMany(notificationIds, state),
  ),
  on(NotificationsActions.clearNotificationsState, (state) =>
    notificationsAdapter.removeAll(state),
  ),
)

export function notificationsReducer(state: NotificationsState | undefined, action: Action) {
  return reducer(state, action)
}
