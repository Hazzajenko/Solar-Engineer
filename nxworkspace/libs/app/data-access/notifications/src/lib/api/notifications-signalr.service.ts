import { Injectable } from '@angular/core'

import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { AppUserLinkModel, MessageModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class NotificationsSignalrService {
  private notificationsHub?: HubConnection

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
      .then(() => this.waitGetAppUserLinks())
      .catch((err) => console.log('Error while starting Users connection: ' + err))
  }

  waitGetAppUserLinks() {
    if (!this.notificationsHub) return
    this.notificationsHub.on('GetNotifications', (users: AppUserLinkModel[]) => {
      console.log('GetNotifications', users)
      // this.messagesStore.dispatch.addManyMessages(message)
    })
  }
}
