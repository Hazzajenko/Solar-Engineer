import { inject, Injectable } from '@angular/core'
import { GroupChatsFacade } from './group-chats.facade'
import { GroupChatsRepository } from './group-chats.repository'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsStoreService {
  public select = inject(GroupChatsFacade)
  public dispatch = inject(GroupChatsRepository)
}
