import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ConnectionModel, NotificationModel } from '@shared/data-access/models'
import { ConnectionsActions } from 'libs/shared/data-access/connections/src/lib/store'
import { NotificationsActions } from 'libs/shared/data-access/notifications/src/lib/store'

@Injectable({
  providedIn: 'root',
})
export class NotificationsRepository {
  private store = inject(Store)

  addNotification(notification: NotificationModel) {
    this.store.dispatch(NotificationsActions.addNotification({ notification }))
  }

  addManyNotifications(notifications: NotificationModel[]) {
    this.store.dispatch(NotificationsActions.addManyNotifications({ notifications }))
  }

  removeNotification(notificationId: string) {
    this.store.dispatch(NotificationsActions.removeNotification({ notificationId }))
  }

  removeManyNotifications(notificationIds: string[]) {
    this.store.dispatch(NotificationsActions.removeManyNotifications({ notificationIds }))
  }
}
