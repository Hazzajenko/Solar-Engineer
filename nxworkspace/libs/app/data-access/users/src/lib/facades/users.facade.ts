import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ConnectionsStoreService } from '@shared/data-access/connections'
import { combineLatestWith, firstValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import { UsersSelectors } from '../store'
import { RouterFacade } from '@shared/data-access/router'
import { UsersService } from '../api'

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private store = inject(Store)
  private connectionsStore = inject(ConnectionsStoreService)
  private routerFacade = inject(RouterFacade)
  private usersService = inject(UsersService)

  users$ = this.store.select(UsersSelectors.selectAllUsers)
  userByRouteParams$ = this.store.select(UsersSelectors.selectUserByRouteParams)
  error$ = this.store.select(UsersSelectors.selectUsersError)
  loaded$ = this.store.select(UsersSelectors.selectUsersLoaded)

  get users() {
    return firstValueFrom(this.users$)
  }

  get usersOnline$() {
    return this.connectionsStore.select.connections$.pipe(
      combineLatestWith(this.users$),
      map(([connections, users]) => {
        const connectionUsernames = connections.map((connection) => connection.userName)
        return users.filter((user) => connectionUsernames.includes(user.userName))
      }),
    )
  }

  /*
    get userByUserNameRoute$(){
      return this.userByRouteParams$.pipe(
        switchMap((user) => {
          if (!user) {
            return this.routerFacade.routeParam$('userName').pipe(
              switchMap((userName) =>
                this.usersService.getUserByUserName(userName).pipe(
                  map((res) => res.user),
                  tap((user) => this.usersStore.dispatch.addUser(user)),
                ),
              ),
            )
          }
          return of(user)
        }),
      )
    }
    }*/
}
