import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { MessageModel } from '@shared/data-access/models'
import { MessagesActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class MessagesRepository {
  private store = inject(Store)


  sendMessageToUser(message: MessageModel) {
    this.store.dispatch(MessagesActions.sendMessageToUser({ message }))
  }

  addMessage(message: MessageModel) {
    this.store.dispatch(MessagesActions.addMessage({ message }))
  }

  updateMessage(update: Update<MessageModel>) {
    this.store.dispatch(MessagesActions.updateMessage({ update }))
  }

  updateManyMessages(updates: Update<MessageModel>[]) {
    this.store.dispatch(MessagesActions.updateManyMessages({ updates }))
  }

  deleteMessage(messageId: number) {
    this.store.dispatch(MessagesActions.deleteMessage({ messageId }))
  }
}
