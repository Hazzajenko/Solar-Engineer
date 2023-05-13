import { inject, Injectable } from '@angular/core'
import { UserMessagesFacade } from './user-messages.facade'
import { UserMessagesRepository } from './user-messages.repository'

@Injectable({
  providedIn: 'root',
})
export class UserMessagesStoreService {
  public select = inject(UserMessagesFacade)
  public dispatch = inject(UserMessagesRepository)
}
