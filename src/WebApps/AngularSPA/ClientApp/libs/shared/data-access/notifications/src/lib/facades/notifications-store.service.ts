import { inject, Injectable } from '@angular/core'
import { NotificationsFacade } from 'libs/shared/data-access/notifications/src/lib/facades/notifications.facade'
import { NotificationsRepository } from 'libs/shared/data-access/notifications/src/lib/facades/notifications.repository'

@Injectable({
  providedIn: 'root',
})
export class NotificationsStoreService {
  public select = inject(NotificationsFacade)
  public dispatch = inject(NotificationsRepository)
}
