import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { map, switchMap } from 'rxjs/operators'
import { UsersActions } from '../store'
import { UsersService } from '../api'

@Injectable({
  providedIn: 'root',
})
export class UsersEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private usersService = inject(UsersService)

  getUserByUserName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.getUserByUsername),
      switchMap(({ userName }) =>
        this.usersService
          .getUserByUserName(userName)
          .pipe(map((res) => UsersActions.addUser({ user: res.user }))),
      ),
    ),
  )
}
