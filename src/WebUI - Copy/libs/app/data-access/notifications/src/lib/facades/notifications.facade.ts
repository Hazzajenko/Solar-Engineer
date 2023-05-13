import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { NotificationsSelectors } from '../store'

@Injectable({
  providedIn: 'root',
})
export class NotificationsFacade {
  private store = inject(Store)

  notifications$ = this.store.select(NotificationsSelectors.selectAllNotifications)
}
