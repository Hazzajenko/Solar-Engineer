import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { NotificationModel } from '@shared/data-access/models'

export const NotificationsActions = createActionGroup({
  source: 'Notifications Store',
  events: {
    'Init Notifications': emptyProps(),
    'Add Notification': props<{ notification: NotificationModel }>(),
    'Add Many Notifications': props<{ notifications: NotificationModel[] }>(),
    'Update One Notification': props<{ update: Update<NotificationModel> }>(),
    'Update Many Notifications': props<{ updates: Update<NotificationModel>[] }>(),
    'Remove Notification': props<{ notificationId: string }>(),
    'Remove Many Notifications': props<{ notificationIds: string[] }>(),
    'Clear Notifications State': emptyProps(),
  },
})
