import { inject, Injectable } from '@angular/core'
import { AuthService } from '@auth/data-access/api'

import { AuthActions } from '@auth/data-access/store'
import { StorageModel } from '@auth/shared/models'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { ProjectsFacade } from '@projects/data-access/facades'
import { ProjectsActions } from '@projects/data-access/store'
import { catchError, map, of, switchMap, tap } from 'rxjs'

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)
  private projectsService = inject(ProjectsFacade)
  success$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        tap((action) => {
          const storage: StorageModel = {
            email: action.user.email,
            username: action.user.username,
            token: action.token,
          }
          localStorage.setItem('solarengineer-user', JSON.stringify(storage))
        }),
        map(() => ProjectsActions.initProjects())
      ),
  )
  signInWithLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInWithLocalstorage),
      switchMap(({ userInStorage }) =>
        this.authService.validateUser(userInStorage).pipe(
          map((response) =>
            AuthActions.signInSuccess({
              user: {
                username: response.username,
                lastName: response.lastName,
                firstName: response.firstName,
                email: response.email,
              },
              token: response.token,
            }),
          ),
          catchError((error: Error) => of(AuthActions.signInError({ error: error.message }))),
        ),
      ),
    ),
  )
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      switchMap(({ req }) =>
        this.authService.signIn(req).pipe(
          map((response) =>
            AuthActions.signInSuccess({
              user: {
                username: response.username,
                lastName: response.lastName,
                firstName: response.firstName,
                email: response.email,
              },
              token: response.token,
            }),
          ),
          catchError((error: Error) => of(AuthActions.signInError({ error: error.message }))),
        ),
      ),
    ),
  )
}
