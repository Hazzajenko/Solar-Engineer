import { inject, Injectable } from '@angular/core'
import { FriendsActions, FriendsStoreService } from '@app/data-access/friends'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { ConnectionsActions, ConnectionsService } from '@shared/data-access/connections'
import { FriendModel } from '@shared/data-access/models'
import { combineLatestWith } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)

  // private panelsService = inject(PathsService)
  // private projectsFacade = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private connectionsService = inject(ConnectionsService)
  private friendsStore = inject(FriendsStoreService)
  initConnections$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        map(({ token }) =>
          this.connectionsService.createHubConnection(token),
        ),
      ),
    { dispatch: false },
  )

  addConnection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConnectionsActions.addConnection),
        combineLatestWith(this.friendsStore.select.friends$),
        map(([{ connection }, friends]) => {
            const friend = friends.find(friend => friend.username === connection.username)
            if (!friend) {
              return ConnectionsActions.connectionNotFriend
            }

            const update: Update<FriendModel> = {
              id: friend.username,
              changes: {
                online: true,
              },
            }

            return FriendsActions.updateFriend({ update })
          },
        ),
      ),
  )

  addManyConnections$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConnectionsActions.addManyConnections),
        combineLatestWith(this.friendsStore.select.friends$),
        map(([{ connections }, friends]) => {
            const connectionUsernames = connections.map(connection => connection.username)
            const connectionFriends = friends.filter(friend => connectionUsernames.includes(friend.username))
            if (connectionFriends.length < 1) {
              return ConnectionsActions.connectionNotFriend()
            }

            const updates: Update<FriendModel>[] = connectionFriends.map(cF => {
              const update: Update<FriendModel> = {
                id: cF.username,
                changes: {
                  online: true,
                },
              }
              return update
            })


            return FriendsActions.updateManyFriends({ updates })
          },
        ),
      ),
  )

  removeConnection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConnectionsActions.removeConnection),
        combineLatestWith(this.friendsStore.select.friends$),
        map(([{ connection }, friends]) => {
            const friend = friends.find(friend => friend.username === connection.username)
            if (!friend) {
              return ConnectionsActions.connectionNotFriend()
            }

            const update: Update<FriendModel> = {
              id: friend.username,
              changes: {
                online: false,
              },
            }

            return FriendsActions.updateFriend({ update })
          },
        ),
      ),
  )
}
