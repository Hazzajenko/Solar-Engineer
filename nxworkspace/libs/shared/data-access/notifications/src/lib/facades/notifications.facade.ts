import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'
import { NotificationsSelectors } from '../store'

@Injectable({
  providedIn: 'root',
})
export class NotificationsFacade {
  private store = inject(Store)

  notifications$ = this.store.select(NotificationsSelectors.selectAllNotifications)
  unreadNotifications$ = this.store.select(NotificationsSelectors.selectUnreadNotifications)
  error$ = this.store.select(NotificationsSelectors.selectNotificationsError)
  loaded$ = this.store.select(NotificationsSelectors.selectNotificationsLoaded)

  get notifications() {
    return firstValueFrom(this.notifications$)
  }

  get unreadNotifications() {
    return firstValueFrom(this.unreadNotifications$)
  }

}
