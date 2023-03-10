import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { Logger, LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class MessagesSignalrService extends Logger {
  private messagesHubConnection?: HubConnection

  // private logger = inject(LoggerService)

  constructor(logger: LoggerService) {
    super(logger)
  }

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
      // .then(() => console.log('Messages Hub Connection started'))
      .catch((err) => {
        this.logError('Error while starting Messages Hub connection: ' + err)
        /*        this.logger.error({
                  source: 'Messages-Signalr-Service',
                  objects: ['Error while starting Messages Hub connection: ' + err],
                })*/
        // console.error('Error while starting Messages Hub connection: ' + err)
        throw new Error('Error while starting Messages Hub connection: ' + err)
      })
    return this.messagesHubConnection
  }

  stopHubConnection() {
    if (!this.messagesHubConnection) return
    this.messagesHubConnection
      .stop()
      .catch((error) => this.logError('Error while stopping Hub connection: ' + error))
    /*this.logger.error({
      source: 'Messages-Signalr-Service',
      objects: ['Error while stopping Hub connection: ' + error],
    }))*/
  }
}
