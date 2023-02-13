import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'
import { ChatRoomsSelectors } from '../store'

@Injectable({
  providedIn: 'root',
})
export class ChatRoomsFacade {
  private store = inject(Store)
  chatRoomToMessage$ = this.store.select(ChatRoomsSelectors.selectChatRoomToMessage)
  userNameToMessage$ = this.store.select(ChatRoomsSelectors.selectUserNameToMessage)
  groupIdToMessage$ = this.store.select(ChatRoomsSelectors.selectGroupIdToMessage)
  currentChatRoom$ = this.store.select(ChatRoomsSelectors.selectCurrentChatRoom)

  get userNameToMessage() {
    return firstValueFrom(this.userNameToMessage$)
  }
}
