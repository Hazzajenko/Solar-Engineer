import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

@Injectable({
  providedIn: 'root',
})
export class MessagesSignalrService {
  private messagesHubConnection?: HubConnection

  createMessagesHubConnection(token: string) {
    this.messagesHubConnection = new HubConnectionBuilder()
      .withUrl('/messages', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    this.messagesHubConnection
      .start()
      .then(() => console.log('Messages Hub Connection started'))
      .catch((err) => {
        console.error('Error while starting Messages Hub connection: ' + err)
        throw new Error('Error while starting Messages Hub connection: ' + err)
      })
    return this.messagesHubConnection
  }

  stopHubConnection() {
    if (!this.messagesHubConnection) return
    this.messagesHubConnection.stop().catch((error) => console.log(error))
  }
}
