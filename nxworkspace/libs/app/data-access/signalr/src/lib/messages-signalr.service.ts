import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { MessageModel } from '@shared/data-access/models'
import { SignalrLogger } from '@shared/data-access/signalr'

@Injectable({
  providedIn: 'root',
})
export class MessagesSignalrService {
  public messagesHub?: HubConnection

  createMessagesConnection(token: string) {
    this.messagesHub = new HubConnectionBuilder()
      .withUrl('/ws/hubs/messages', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(new SignalrLogger())
      .withAutomaticReconnect()
      .build()

    this.messagesHub
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err))

    /*    this.messagesHub.on('getMessages', (message: MessageModel) => {
          if (Array.isArray(message)) {
            console.log('Array.isArray(message)', message)
            this.messagesStore.dispatch.addManyMessages(message)
          } else {
            console.log('getMessages', message)
            this.messagesStore.dispatch.addMessage(message)
          }
        })*/
  }

  /*
    sendMessageToUserSignalR(request: SendMessageRequest) {
      if (!this.messagesHub) return
      return this.messagesHub.invoke('SendMessageToUser', request)
        .catch(error => console.log(error))
    }

    getMessagesWithUserSignalR(userName: string) {
      if (!this.messagesHub) return
      this.messagesHub.invoke('getMessages', userName)
        .then((data) => {
          console.log(data)
      })
    }  */
}
