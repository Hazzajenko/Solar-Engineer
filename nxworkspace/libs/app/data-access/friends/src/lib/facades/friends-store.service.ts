import { inject, Injectable } from '@angular/core'
import { FriendsFacade } from './friends.facade'
import { FriendsRepository } from './friends.repository'


@Injectable({
  providedIn: 'root',
})
export class FriendsStoreService {
  public select = inject(FriendsFacade)
  public dispatch = inject(FriendsRepository)
}
