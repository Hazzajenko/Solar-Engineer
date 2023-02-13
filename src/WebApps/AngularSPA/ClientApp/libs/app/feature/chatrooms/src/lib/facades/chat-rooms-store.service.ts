import { inject, Injectable } from '@angular/core'
import { ChatRoomsFacade } from './chat-rooms.facade'
import { ChatRoomsRepository } from './chat-rooms.repository'

@Injectable({
  providedIn: 'root',
})
export class ChatRoomsStoreService {
  public select = inject(ChatRoomsFacade)
  public dispatch = inject(ChatRoomsRepository)
}
