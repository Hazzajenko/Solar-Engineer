import { inject, Injectable } from '@angular/core'
import { HubConnection } from '@microsoft/signalr'
import { MessageModel } from '@shared/data-access/models'
import { UserMessagesStoreService } from '../../services/user-messages'
import { GetMessages, SendMessageToUser } from './user-messages-signalr.methods'
import { SendMessageRequest } from '../../models/requests/send-message.request'

// import { SendMessageRequest } from '../../models'

@Injectable({
  providedIn: 'root',
})
export class UserMessagesSignalrService {
  private messagesStore = inject(UserMessagesStoreService)
  // private messagesSignalRService = inject(SignalrService)
  /*  messagesHubConnection: HubConnection =
      this.messagesSignalRService.messagesHubConnection ??
      throwExpression('Not connected to messages hub')*/
  messagesHubConnection?: HubConnection

  initUserMessagesHandlers(messagesHubConnection: HubConnection) {
    this.messagesHubConnection = messagesHubConnection
    this.messagesHubConnection.on(GetMessages, (messages: MessageModel[]) => {
      this.messagesStore.dispatch.addManyMessages(messages)
    })
  }

  sendMessageToUser(request: SendMessageRequest) {
    if (!this.messagesHubConnection) return
    this.messagesHubConnection
      .invoke(SendMessageToUser, request)
      .catch((error) => console.error(error))
  }

  getMessagesWithUser(userId: string) {
    if (!this.messagesHubConnection) return
    this.messagesHubConnection.invoke(GetMessages, userId).catch((error) => console.error(error))
  }
}
