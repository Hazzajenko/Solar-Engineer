import { inject, Injectable } from '@angular/core'

import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { AppUserLinkModel, MessageModel, NotificationModel } from '@shared/data-access/models'
import { NotificationsStoreService } from '@app/data-access/notifications'

@Injectable({
  providedIn: 'root',
})
export class NotificationsSignalrService {
  private notificationsHub?: HubConnection
  private notificationsStore = inject(NotificationsStoreService)

  createNotificationsConnection(token: string) {
    this.notificationsHub = new HubConnectionBuilder()
      .withUrl('/ws/hubs/notifications', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    this.notificationsHub
      .start()
      .then(() => console.log('Notifications Connection started'))
      .then(() => this.waitGetNotifications())
      .catch((err) => console.log('Error while starting Users connection: ' + err))
  }

  waitGetNotifications() {
    if (!this.notificationsHub) return
    this.notificationsHub.on('GetNotifications', (notifications: NotificationModel[]) => {
      console.log('GetNotifications', notifications)
      this.notificationsStore.dispatch.addManyNotifications(notifications)
      // this.messagesStore.dispatch.addManyMessages(message)
    })
  }
}
