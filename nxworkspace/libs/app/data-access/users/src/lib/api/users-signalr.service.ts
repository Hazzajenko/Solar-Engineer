import { Injectable } from '@angular/core'

import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

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
      .catch((err) => console.log('Error while starting Users connection: ' + err))
  }
}
