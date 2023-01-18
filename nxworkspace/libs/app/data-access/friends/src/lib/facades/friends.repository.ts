import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
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

  updateFriend(update: Update<FriendModel>) {
    this.store.dispatch(FriendsActions.updateFriend({ update }))
  }

  removeFriend(friendUsername: string) {
    this.store.dispatch(FriendsActions.removeFriend({ friendUsername }))
  }

  acceptFriendRequest(friendUsername: string) {
    this.store.dispatch(FriendsActions.acceptFriendRequest({ friendUsername }))
  }
}
