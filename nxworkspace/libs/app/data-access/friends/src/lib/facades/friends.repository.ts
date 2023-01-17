import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { FriendModel } from '@shared/data-access/models'
import { FriendsActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class FriendsRepository {
  private store = inject(Store)

  addFriend(friend: FriendModel) {
    this.store.dispatch(FriendsActions.addFriend({ friend }))
  }

  removeFriend(friendUsername: string) {
    this.store.dispatch(FriendsActions.removeFriend({ friendUsername }))
  }

  acceptFriendRequest(friendUsername: string) {
    this.store.dispatch(FriendsActions.acceptFriendRequest({ friendUsername }))
  }
}
