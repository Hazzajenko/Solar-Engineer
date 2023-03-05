import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

@Injectable({
  providedIn: 'root',
})
export class MessagesSignalrService {
  public messagesHub?: HubConnection

  /*  createMessagesConnection(token: string) {
      this.messagesHub = new HubConnectionBuilder()
        .withUrl('/ws/hubs/messages', {
          accessTokenFactory: () => token,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build()

      this.messagesHub
        .start()
        // .then(() => console.log('Connection started'))
        .catch((err) => console.log('Error while starting connection: ' + err))
    }*/
}
