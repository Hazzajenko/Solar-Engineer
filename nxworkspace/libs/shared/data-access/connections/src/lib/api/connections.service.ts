import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access/facades'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { ConnectionModel } from '@shared/data-access/models'
import { SignalrLogger } from '@shared/data-access/signalr'
import { ConnectionsStoreService } from 'libs/shared/data-access/connections/src/lib/facades'
import { BehaviorSubject, take } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsService {
  private hubConnection?: HubConnection
  private onlineUsersSource = new BehaviorSubject<string[]>([])
  private authStore = inject(AuthStoreService)
  private connectionsStore = inject(ConnectionsStoreService)
  onlineUsers$ = this.onlineUsersSource.asObservable()

  constructor(private router: Router) {
  }

  createHubConnection(token: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/ws/hubs/connections', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(new SignalrLogger())
      .withAutomaticReconnect()
      .build()
  }

  connectSignalR() {
    if (!this.hubConnection) return

    this.hubConnection
      .start()
      .then(this.startSuccess, this.startFail)
      .catch(error => console.log(error))

    this.hubConnection.on('UserIsOnline', username => {
      // this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
      //   this.onlineUsersSource.next([...usernames, username])
      // })
      this.connectionsStore.dispatch.addConnection(username)
    })

    this.hubConnection.on('UserIsOffline', username => {
      // this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
      //   this.onlineUsersSource.next([...usernames.filter(x => x !== username)])
      // })
      this.connectionsStore.dispatch.removeConnection(username)
    })

    this.hubConnection.on('GetOnlineUsers', (connections: ConnectionModel[]) => {
      this.connectionsStore.dispatch.addManyConnections(connections)
    })

    /*    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
          this.onlineUsersSource.next(usernames)
          this.connectionsStore.dispatch.addManyConnections(usernames)
        })*/

    // this.hubConnection.invoke('GetOnlineUsers').then(res => console.log(res))
  }

  startSuccess() {
    if (!this.hubConnection) return
    console.log('Connected.')
    this.hubConnection.invoke('UserIsOnline').then((online) => {
      console.log(online)
    })
  }

  startFail() {
    console.log('Connection failed.')
  }

  stopHubConnection() {
    if (!this.hubConnection) return
    this.hubConnection.stop().catch(error => console.log(error))
  }
}