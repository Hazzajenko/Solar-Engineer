import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { catchError, map, switchMap } from 'rxjs/operators'
import { UsersActions } from '../store'
import { UsersService } from '../api'
import { AuthService } from '@auth/data-access/api'
import { AuthFacade } from '@auth/data-access/facades'
import { HttpStatusCode } from '@angular/common/http'
import { AuthActions } from '@auth/data-access/store'
import { Update } from '@ngrx/entity'
import { UserModel } from '@shared/data-access/models'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UsersEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private usersService = inject(UsersService)
  private authFacade = inject(AuthFacade)

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

  updateAppUserDisplayPictureWithIcon = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateAppuserDisplayPictureWithIcon),
        switchMap(({ request }) =>
          this.usersService.updateDisplayPicture(request).pipe(
            map(() => {

              const update: Partial<UserModel> = {
                photoUrl: request.image.imageName,
              }
              return AuthActions.updateUser({ update })

            }),
            catchError((err: Error) => of(AuthActions.addError({ error: err.message }))),
          ),
        ),
      ),
    // { dispatch: false }
  )
}
