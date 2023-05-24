import { inject, Injectable } from '@angular/core'
import { AuthActions } from '@auth/data-access'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { ProjectsStoreService } from '@projects/data-access'

import { map, switchMap } from 'rxjs/operators'
import { FriendsService } from '../api'
import { FriendsActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class FriendsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)

  // private panelsService = inject(PathsEventService)
  // private projectsFacade = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private friendsService = inject(FriendsService)
  initFriends$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        switchMap(() =>
          this.friendsService
            .getAllFriends()
            .pipe(map((response) => FriendsActions.addManyFriends({ friends: response.friends }))),
        ),
      ),
    // { dispatch: false },
  )

  sendFriendRequest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FriendsActions.sendFriendRequest),
        switchMap(({ friendUserName }) => this.friendsService.sendFriendRequest(friendUserName)),
      ),
    { dispatch: false },
  )

  acceptFriend$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FriendsActions.acceptFriendRequest),
      switchMap(({ friendUsername }) =>
        this.friendsService
          .acceptFriendRequest(friendUsername)
          .pipe(map((res) => FriendsActions.addFriend({ friend: res.friend }))),
      ),
    ),
  )
}