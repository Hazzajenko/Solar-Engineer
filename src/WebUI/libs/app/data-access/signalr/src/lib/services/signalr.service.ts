import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { Logger, LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class SignalrService extends Logger {
  constructor(logger: LoggerService) {
    super(logger)
  }

  createHubConnection(
    token: string,
    hubName: string,
    hubUrl: string,
    invoke?: string,
    params?: unknown[],
  ) {
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
        this.logDebug(hubName + ' Hub Connection started')
        if (invoke) {
          this.invokeHubConnection(hubConnection, invoke, params)
        }
      })
      .catch((err) => {
        this.logError('Error while starting ' + hubName + ' Hub connection: ' + err)
      })
    return hubConnection
  }

  invokeHubConnection(hubConnection: HubConnection, invoke: string, params?: unknown[]) {
    if (invoke && params)
      hubConnection.invoke(invoke, params).catch((err) => this.logError(err, invoke, params))
    if (invoke && !params) {
      hubConnection.invoke(invoke).catch((err) => this.logError(err, invoke))
    }
  }
}
