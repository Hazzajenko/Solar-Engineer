import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
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
  private snackBar = inject(MatSnackBar)
  connectionId?: string
  onlineUsers$ = this.onlineUsersSource.asObservable()

  constructor(private router: Router) {}

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

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      /*      .then(() => {
              this.snackBar.open('Connection started', 'OK', {
                duration: 5000,
              })
            })*/
      .catch((err) => console.log('Error while starting connection: ' + err))

    this.hubConnection.on('UserIsOnline', (connection: ConnectionModel) => {
      // this.onlineUsers$.pipe(take(1)).subscribe(userNames => {
      //   this.onlineUsersSource.next([...userNames, userName])
      // })
      this.connectionsStore.dispatch.addConnection(connection)
    })

    this.hubConnection.on('UserIsOffline', (connection: ConnectionModel) => {
      // this.onlineUsers$.pipe(take(1)).subscribe(userNames => {
      //   this.onlineUsersSource.next([...userNames.filter(x => x !== userName)])
      // })
      this.connectionsStore.dispatch.removeConnection(connection)
    })

    this.hubConnection.on('GetOnlineUsers', (connections: ConnectionModel[]) => {
      this.connectionsStore.dispatch.addManyConnections(connections)
    })
  }

  /*  connectSignalR() {
      if (!this.hubConnection) return

      this.hubConnection.on('UserIsOnline', userName => {
        // this.onlineUsers$.pipe(take(1)).subscribe(userNames => {
        //   this.onlineUsersSource.next([...userNames, userName])
        // })
        this.connectionsStore.dispatch.addConnection(userName)
      })

      this.hubConnection.on('UserIsOffline', userName => {
        // this.onlineUsers$.pipe(take(1)).subscribe(userNames => {
        //   this.onlineUsersSource.next([...userNames.filter(x => x !== userName)])
        // })
        this.connectionsStore.dispatch.removeConnection(userName)
      })

      this.hubConnection.on('GetOnlineUsers', (connections: ConnectionModel[]) => {
        this.connectionsStore.dispatch.addManyConnections(connections)
      })

      /!*    this.hubConnection.on('GetOnlineUsers', (userNames: string[]) => {
            this.onlineUsersSource.next(userNames)
            this.connectionsStore.dispatch.addManyConnections(userNames)
          })*!/

      // this.hubConnection.invoke('GetOnlineUsers').then(res => console.log(res))
    }*/

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
    this.hubConnection.stop().catch((error) => console.log(error))
  }
}
