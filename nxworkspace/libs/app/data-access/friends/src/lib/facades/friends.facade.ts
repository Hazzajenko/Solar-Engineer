import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ConnectionsStoreService } from '@app/data-access/connections'
import { combineLatestWith, firstValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import { FriendsSelectors } from '../store'

@Injectable({
  providedIn: 'root',
})
export class FriendsFacade {
  private store = inject(Store)
  private connectionsStore = inject(ConnectionsStoreService)

  friends$ = this.store.select(FriendsSelectors.selectAllFriends)
  error$ = this.store.select(FriendsSelectors.selectFriendsError)
  loaded$ = this.store.select(FriendsSelectors.selectFriendsLoaded)

  get friends() {
    return firstValueFrom(this.friends$)
  }

  get friendsOnline$() {
    return this.connectionsStore.select.connections$.pipe(
      combineLatestWith(this.friends$),
      map(([connections, friends]) => {
        const connectionUsernames = connections.map(connection => connection.username)
        return friends.filter(friend => connectionUsernames.includes(friend.username))
      }),
    )
  }
}
