import { inject, Injectable } from '@angular/core'
import { FriendsFacade } from 'libs/app/data-access/friends/src/lib/facades/friends.facade'
import { FriendsRepository } from 'libs/app/data-access/friends/src/lib/facades/friends.repository'

@Injectable({
  providedIn: 'root',
})
export class FriendsStoreService {
  public select = inject(FriendsFacade)
  public dispatch = inject(FriendsRepository)
}
