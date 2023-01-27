import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { MessageModel } from '@shared/data-access/models'
import { SendMessageRequest } from '../models'
import { MessagesActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class MessagesRepository {
  private store = inject(Store)

  initMessagesWithUser(userName: string) {
    this.store.dispatch(MessagesActions.initMessagesWithUser({ userName }))
  }

  sendMessageToUser(request: SendMessageRequest) {
    this.store.dispatch(MessagesActions.sendMessageToUser({ request }))
  }

  addMessage(message: MessageModel) {
    this.store.dispatch(MessagesActions.addMessage({ message }))
  }

  addManyMessages(messages: MessageModel[]) {
    this.store.dispatch(MessagesActions.addManyMessages({ messages }))
  }

  updateMessage(update: Update<MessageModel>) {
    this.store.dispatch(MessagesActions.updateMessage({ update }))
  }

  markAllMessagesAsReadWithUser(recipient: string) {
    this.store.dispatch(MessagesActions.markAllMessagesAsReadWithUser({ recipient }))
  }

  updateManyMessages(updates: Update<MessageModel>[]) {
    this.store.dispatch(MessagesActions.updateManyMessages({ updates }))
  }

  deleteMessage(messageId: number) {
    this.store.dispatch(MessagesActions.deleteMessage({ messageId }))
  }
}
