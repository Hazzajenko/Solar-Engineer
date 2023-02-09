import { inject, Injectable } from '@angular/core'
import { AuthService } from '../api/auth.service'
import { AuthActions } from '../store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap } from 'rxjs'

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(() =>
        this.authService.login().pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: response.user,
            }),
          ),
          catchError((error: Error) => {
            console.error(error)
            return of(AuthActions.loginError({ error: error.message }))
          }),
        ),
      ),
    ),
  )
}
