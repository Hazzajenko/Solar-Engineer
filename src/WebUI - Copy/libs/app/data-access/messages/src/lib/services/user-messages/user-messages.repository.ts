import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { MessageModel } from '@shared/data-access/models'
// import { SendMessageRequest } from '../../models'
import { UserMessagesActions } from '../../store'
import { SendMessageRequest } from '../../models/requests/send-message.request'

@Injectable({
  providedIn: 'root',
})
export class UserMessagesRepository {
  private store = inject(Store)

  initMessagesWithUser(userName: string) {
    this.store.dispatch(UserMessagesActions.initMessagesWithUser({ userId: userName }))
  }

  sendMessageToUser(request: SendMessageRequest) {
    this.store.dispatch(UserMessagesActions.sendMessageToUser({ request }))
  }

  addMessage(message: MessageModel) {
    this.store.dispatch(UserMessagesActions.addMessage({ message }))
  }

  addManyMessages(messages: MessageModel[]) {
    this.store.dispatch(UserMessagesActions.addManyMessages({ messages }))
  }

  updateMessage(update: Update<MessageModel>) {
    this.store.dispatch(UserMessagesActions.updateMessage({ update }))
  }

  markAllMessagesAsReadWithUser(recipient: string) {
    this.store.dispatch(UserMessagesActions.markAllMessagesAsReadWithUser({ recipient }))
  }

  updateManyMessages(updates: Update<MessageModel>[]) {
    this.store.dispatch(UserMessagesActions.updateManyMessages({ updates }))
  }

  deleteMessage(messageId: number) {
    this.store.dispatch(UserMessagesActions.deleteMessage({ messageId }))
  }
}
