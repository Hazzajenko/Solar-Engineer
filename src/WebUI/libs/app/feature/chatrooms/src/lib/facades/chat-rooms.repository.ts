import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ChatRoomsActions } from '../store'
import { MessageTimeSortModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class ChatRoomsRepository {
  private store = inject(Store)

  selectChatRoomToMessage(chatRoomToMessage: MessageTimeSortModel) {
    this.store.dispatch(ChatRoomsActions.selectChatRoomToMessage({ chatRoomToMessage }))
  }

  selectUserToMessage(userNameToMessage: string) {
    this.store.dispatch(ChatRoomsActions.selectUserToMessage({ userNameToMessage }))
  }

  selectGroupToMessage(groupIdToMessage: number) {
    this.store.dispatch(ChatRoomsActions.selectGroupToMessage({ groupIdToMessage }))
  }
}
