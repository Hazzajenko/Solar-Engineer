import { inject, Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { ConnectionModel } from '@shared/data-access/models'
import { ConnectionsStoreService } from '../services'
import { GetOnlineUsers, UserIsOffline, UserIsOnline } from './connections.methods'
import { Logger, LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsSignalrService extends Logger {
  private hubConnection?: HubConnection
  private connectionsStore = inject(ConnectionsStoreService)

  // private logger = inject(LoggerService)

  constructor(logger: LoggerService) {
    super(logger)
  }

  createHubConnection(token: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/hubs/connections', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .then(
        () => this.logDebug('Hub Connection started'),
        /*this.logger.debug({ source: 'Connections-Signalr-Service', objects: ['Hub Connection started'] })*/
      )
      .catch(
        (err) => this.logError('Error while starting Hub connection: ' + err),
        /*this.logger.error({
        source: 'Connections-Signalr-Service',
        objects: ['Error while starting Hub connection: ' + err],
      })*/
      )

    this.hubConnection.on(UserIsOnline, (connections: ConnectionModel[]) => {
      this.connectionsStore.dispatch.addManyConnections(connections)
    })

    this.hubConnection.on(UserIsOffline, (connections: ConnectionModel[]) => {
      this.connectionsStore.dispatch.removeManyConnections(connections)
    })

    this.hubConnection.on(GetOnlineUsers, (connections: ConnectionModel[]) => {
      this.connectionsStore.dispatch.addManyConnections(connections)
    })
  }

  stopHubConnection() {
    if (!this.hubConnection) return
    this.hubConnection.stop().catch(
      (error) => this.logError('Error while stopping Hub connection: ' + error),
      /*this.logger.error({
      source: 'Connections-Signalr-Service',
      objects: ['Error while stopping Hub connection: ' + error],
    })*/
    )
  }
}
