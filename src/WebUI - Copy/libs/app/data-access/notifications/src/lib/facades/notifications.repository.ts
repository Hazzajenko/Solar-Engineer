import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { NotificationModel } from '@shared/data-access/models'
import { NotificationsActions } from '../store'

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

  updateNotification(update: Update<NotificationModel>) {
    this.store.dispatch(NotificationsActions.updateNotification({ update }))
  }

  updateManyNotifications(updates: Update<NotificationModel>[]) {
    this.store.dispatch(NotificationsActions.updateManyNotifications({ updates }))
  }

  removeNotification(notificationId: number) {
    this.store.dispatch(NotificationsActions.removeNotification({ notificationId }))
  }
}
