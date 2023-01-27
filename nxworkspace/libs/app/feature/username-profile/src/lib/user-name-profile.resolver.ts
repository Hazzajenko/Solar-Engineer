import { inject, Injectable } from '@angular/core'
import { ActivatedRoute, Resolve } from '@angular/router'
import { map, Observable, of, switchMap, tap } from 'rxjs'

import { UserModel } from '@shared/data-access/models'
import { AuthStoreService } from '@auth/data-access/facades'
import { UsersService, UsersStoreService } from '@app/data-access/users'
import { RouterFacade } from '@shared/data-access/router'

@Injectable({
  providedIn: 'root',
})
export class UserNameProfileResolver implements Resolve<Observable<UserModel>> {
  private usersService = inject(UsersService)
  private authStore = inject(AuthStoreService)
  private usersStore = inject(UsersStoreService)
  private routerFacade = inject(RouterFacade)
  private route = inject(ActivatedRoute)

  resolve() {
    return this.usersStore.select.userByRouteParams$.pipe(
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
}
