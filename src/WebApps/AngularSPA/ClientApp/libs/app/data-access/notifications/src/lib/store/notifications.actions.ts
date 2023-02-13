import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { NotificationModel } from '@shared/data-access/models'

export const NotificationsActions = createActionGroup({
  source: 'Notifications Store',
  events: {
    'Init Notifications': emptyProps(),
    'Read Notification': props<{ notificationId: number }>(),
    'Add Notification': props<{ notification: NotificationModel }>(),
    'Add Many Notifications': props<{ notifications: NotificationModel[] }>(),
    'Update Notification': props<{ update: Update<NotificationModel> }>(),
    'Update Many Notifications': props<{ updates: Update<NotificationModel>[] }>(),
    'Remove Notification': props<{ notificationId: number }>(),
    'Remove Many Notifications': props<{ notificationIds: number[] }>(),
    'Clear Notifications State': emptyProps(),
  },
})
