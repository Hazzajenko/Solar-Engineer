import { inject, Injectable } from '@angular/core'
import { NotificationsFacade } from './notifications.facade'
import { NotificationsRepository } from './notifications.repository'

@Injectable({
  providedIn: 'root',
})
export class NotificationsStoreService {
  public select = inject(NotificationsFacade)
  public dispatch = inject(NotificationsRepository)
}
