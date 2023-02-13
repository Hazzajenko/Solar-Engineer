import { inject, Injectable } from '@angular/core'
import { MessagesFacade } from './messages.facade'
import { MessagesRepository } from './messages.repository'

@Injectable({
  providedIn: 'root',
})
export class MessagesStoreService {
  public select = inject(MessagesFacade)
  public dispatch = inject(MessagesRepository)
}
