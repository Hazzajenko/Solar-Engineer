import { inject, Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private logger = inject(LoggerService)

  createHubConnection(token: string, hubName: string, hubUrl: string, then?: Function) {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()
    hubConnection
      .start()
      .then(() => {
        this.logger.debug({
          source: 'SignalrService',
          objects: [hubName + ' Hub Connection started'],
        })
      })
      .catch((err) => {
        this.logger.error({
          source: 'SignalrService',
          objects: ['Error while starting ' + hubName + ' Hub connection: ' + err],
        })
        throw new Error('Error while starting ' + hubName + ' Hub connection: ' + err)
      })
    // resolve(hubConnection)
    if (then) then()
    return hubConnection
  }
}
