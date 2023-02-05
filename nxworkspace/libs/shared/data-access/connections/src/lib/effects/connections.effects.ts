import { inject, Injectable } from '@angular/core'
import { FriendsActions, FriendsStoreService } from '@app/data-access/friends'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { ConnectionsActions, ConnectionsService } from '@shared/data-access/connections'
import { FriendModel } from '@shared/data-access/models'
import { combineLatestWith, switchMap } from 'rxjs'
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
        map(({ token }) => this.connectionsService.createHubConnection(token)),
      ),
    { dispatch: false },
  )
  /*
    addConnection$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(ConnectionsActions.addConnection),
          switchMap(({ connection }) => this.friendsStore.select.friends$.pipe(
            map(friends =>
              friends.find(friend => friend.userName === connection.userName)
            ),
            map(friend => {
              if (!friend) {
                return ConnectionsActions.connectionNotFriend()
              }
              const update: Update<FriendModel> = {
                id: friend.userName,
                changes: {
                  online: true,
                },
              }

              return NotificationsActions.updateFriend({ update })
            })
          )),
        ),
    )

    addManyConnections$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(ConnectionsActions.addManyConnections),
          switchMap(({ connections }) => this.friendsStore.select.friends$.pipe(
            map(friends =>
              friends.filter(friend =>
                connections.map(connection => connection.userName).includes(friend.userName))),
            map(friends => {
              if (friends.length < 1) {
                return ConnectionsActions.connectionNotFriend()
              }
              const updates: Update<FriendModel>[] = friends.map(cF => {
                const update: Update<FriendModel> = {
                  id: cF.userName,
                  changes: {
                    online: true,
                  },
                }
                return update
              })


              return NotificationsActions.updateManyFriends({ updates })
            })
          )),
        ),
    )*/
  /*
    removeConnection$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ConnectionsActions.removeConnection),
        combineLatestWith(this.friendsStore.select.friends$),
        map(([{ connection }, friends]) => {
          const friend = friends.find((friend) => friend.userName === connection.userName)
          if (!friend) {
            return ConnectionsActions.connectionNotFriend()
          }

          const update: Update<FriendModel> = {
            id: friend.userName,
            changes: {
              online: false,
            },
          }

          return NotificationsActions.updateFriend({ update })
        }),
      ),
    )*/
}
