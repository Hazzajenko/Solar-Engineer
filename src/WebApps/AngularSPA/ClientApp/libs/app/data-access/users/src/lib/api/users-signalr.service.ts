import { Injectable } from '@angular/core'

import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { AppUserLinkModel, MessageModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class UsersSignalrService {
  private usersHub?: HubConnection

  createUsersConnection(token: string) {
    this.usersHub = new HubConnectionBuilder()
      .withUrl('/ws/hubs/users', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    this.usersHub
      .start()
      .then(() => console.log('Users Connection started'))
      .then(() => this.waitGetAppUserLinks())
      .catch((err) => console.log('Error while starting Users connection: ' + err))
  }

  waitGetAppUserLinks() {
    if (!this.usersHub) return
    this.usersHub.on('GetAppUserLinks', (users: AppUserLinkModel[]) => {
      console.log('GetAppUserLinks', users)
      // this.messagesStore.dispatch.addManyMessages(message)
    })
  }
}
