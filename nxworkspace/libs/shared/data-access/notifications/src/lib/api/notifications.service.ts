import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { SignalrLogger } from '@shared/data-access/signalr'
import { NotificationsStoreService } from 'libs/shared/data-access/notifications/src/lib/facades'

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  private notificationHub?: HubConnection
  private notificationsStore = inject(NotificationsStoreService)
  connectionId?: string

  constructor(private router: Router) {
  }

  createNotificationsConnection(token: string) {
    this.notificationHub = new HubConnectionBuilder()
      .withUrl('/ws/hubs/notifications', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(new SignalrLogger())
      .withAutomaticReconnect()
      .build()

    this.notificationHub
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.getConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))

    this.notificationHub.on('getNotifications', notification => {
      console.log('getNotifications', notification)
      this.notificationsStore.dispatch.addNotification(notification)
    })
  }

  /*  connectSignalR() {
      if (!this.notificationHub) return

      this.notificationHub
        .start()
        .then(() => console.log('Connection started'))
        .then(() => this.getConnectionId())
        .catch(err => console.log('Error while starting connection: ' + err))

      this.notificationHub.on('getNotifications', notification => {
        console.log('getNotifications', notification)
      })
    }*/

  private getConnectionId = () => {
    if (!this.notificationHub) return
    this.notificationHub.invoke('getConnectionId')
      .then((data) => {
        console.log(data)
        this.connectionId = data
        this.getNotifications()
      })
  }
  public getNotifications = () => {
    if (!this.notificationHub) return
    if (!this.connectionId) return
    this.notificationHub.invoke('GetNotifications', this.connectionId)
      .catch(err => console.error(err))
  }


  stopHubConnection() {
    if (!this.notificationHub) return
    this.notificationHub.stop().catch(error => console.log(error))
  }
}