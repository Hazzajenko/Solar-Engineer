import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ConnectionsStoreService } from '@shared/data-access/connections'
import { combineLatest, combineLatestWith, EMPTY, firstValueFrom, Observable, of, tap } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { UsersActions, UsersSelectors } from '../store'
import { RouterFacade } from '@shared/data-access/router'
import { UsersService } from '../api'
import { CombinedAppUserModel, WebUserModel } from '@shared/data-access/models'
import { FriendsSelectors, FriendsStoreService } from '@app/data-access/friends'
import { AuthSelectors } from '@auth/data-access/store'
import { ProjectsSelectors } from '@projects/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private store = inject(Store)
  private connectionsStore = inject(ConnectionsStoreService)
  private routerFacade = inject(RouterFacade)
  private usersService = inject(UsersService)
  private friendsStore = inject(FriendsStoreService)

  users$ = this.store.select(UsersSelectors.selectAllUsers)
  userByRouteParams$ = this.store.select(UsersSelectors.selectUserByRouteParams)
  error$ = this.store.select(UsersSelectors.selectUsersError)
  loaded$ = this.store.select(UsersSelectors.selectUsersLoaded)

  personalCombinedAppUser$ = combineLatest([
    this.store.select(AuthSelectors.selectUser),
    this.store.select(ProjectsSelectors.selectAllProjects),
    this.store.select(FriendsSelectors.selectAllFriends)
  ]).pipe(map(
    ([user, projects, friends]) => ({
      ...user,
      projectsLength: projects.length,
      friendsLength: friends.length
    } as CombinedAppUserModel)
  ))

  usersOnline$ = this.connectionsStore.select.connections$.pipe(
    combineLatestWith(this.users$),
    map(([connections, users]) => {
      const connectionUsernames = connections.map((connection) => connection.userName)
      return users.filter((user) => connectionUsernames.includes(user.userName))
    }),
  )
  users = firstValueFrom(this.users$)

  userByUserName$(userName: string) {
    return this.users$.pipe(map((users) => users.find((user) => user.userName === userName)))
  }

  userByUserNameWithOnline$(userName: string) {
    return combineLatest([
      this.users$.pipe(map((users) => users.find((user) => user.userName === userName))),
      this.connectionsStore.select.isUserOnline$(userName),
    ]).pipe(map(([user, isOnline]) => ({ ...user, isOnline } as WebUserModel)))
  }

  webUserCombinedByUserName$(userName: string): Observable<WebUserModel> {
    return this.userByUserName$(userName).pipe(
      switchMap((user) => {
        if (!user) {
          return this.usersService.getUserByUserName(userName).pipe(
            map((res) => res.user),
            tap((user) => this.store.dispatch(UsersActions.addUser({ user }))),
          )
        }
        return of(user)
      }),
      switchMap((user) =>
        combineLatest([
          of(user),
          this.connectionsStore.select.isUserOnline$(user.userName),
          this.friendsStore.select.getUserFriendStatus$(user.userName),
        ]),
      ),
      map(([user, isOnline, isFriend]) => ({ ...user, ...isFriend, isOnline } as WebUserModel)),
    )
  }

}