import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { ConnectionModel } from '@shared/data-access/models'
import { ConnectionsStoreService } from '../services'
import { GetOnlineUsers, UserIsOffline, UserIsOnline } from './connections.methods'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsSignalrService {
  private hubConnection?: HubConnection
  private connectionsStore = inject(ConnectionsStoreService)

  createHubConnection(token: string) {
    this.hubConnection = new HubConnectionBuilder()
      // .withUrl('/users/hubs/connections', {
      // .withUrl('https://localhost:6004/hubs/connections', {
      // .withUrl('https://localhost:6000/users/hubs/connections', {
      // .withUrl('https://localhost:6000/connections', {
      // .withUrl('/hubs/connections', {
      // .withUrl('/ws-gateway/connections', {
      .withUrl('/connections-hub', {
        // .withUrl('/signalr/users/hubs/connections', {
        // .withUrl('/ws/hubs/connections', {
        // .withUrl('/ws/connections', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err))

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
    this.hubConnection.stop().catch((error) => console.log(error))
  }
}
