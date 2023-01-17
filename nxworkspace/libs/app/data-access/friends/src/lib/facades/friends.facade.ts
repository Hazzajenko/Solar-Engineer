import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'
import { FriendsSelectors } from '../store'

@Injectable({
  providedIn: 'root',
})
export class FriendsFacade {
  private store = inject(Store)

  friends$ = this.store.select(FriendsSelectors.selectAllFriends)
  error$ = this.store.select(FriendsSelectors.selectFriendsError)
  loaded$ = this.store.select(FriendsSelectors.selectFriendsLoaded)

  get friends() {
    return firstValueFrom(this.friends$)
  }

}
