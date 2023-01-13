import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access/facades'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { UserModel } from '@shared/data-access/models'
import { BehaviorSubject, take } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsService {
  private hubConnection!: HubConnection
  private onlineUsersSource = new BehaviorSubject<string[]>([])
  private authStore = inject(AuthStoreService)
  onlineUsers$ = this.onlineUsersSource.asObservable()

  constructor(private router: Router) {
  }

  createHubConnection(token: string) {
    /*    const token = await this.authStore.select.token
        if (!token) return*/
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/api/connections', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .catch(error => console.log(error))

    this.hubConnection.on('UserIsOnline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames, username])
      })
    })

    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames.filter(x => x !== username)])
      })
    })

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsersSource.next(usernames)
    })
    /*
        this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
          this.toastr.info(knownAs + ' has sent you a new message!')
            .onTap
            .pipe(take(1))
            .subscribe(() => this.router.navigateByUrl('/members/' + username + '?tab=3'))
        })*/
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error))
  }
}