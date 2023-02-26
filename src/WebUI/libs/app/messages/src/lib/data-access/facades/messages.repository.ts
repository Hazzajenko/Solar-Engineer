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
  /*
    initMessagesWithUser(userName: string) {
      this.store.dispatch(UserMessagesActions.initMessagesWithUser({ userName }))
    }

    sendMessageToUser(request: SendMessageRequest) {
      this.store.dispatch(UserMessagesActions.sendMessageToUser({ request }))
    }

    addMessage(message: MessageModel) {
      this.store.dispatch(UserMessagesActions.addMessage({ message }))
    }

    addManyMessages(user-user-user-messages: MessageModel[]) {
      this.store.dispatch(UserMessagesActions.addManyMessages({ user-user-user-messages }))
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
    }*/
}
