import { inject, Injectable } from '@angular/core'
import { AuthService } from '../api'
import { AuthActions } from '../store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap } from 'rxjs'

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)

  getRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginWithGoogle),
        tap(() => {
          window.location.href = '/auth/login/google'
        }),
      ),
    { dispatch: false },
  )

  authorizeRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authorizeRequest),
      switchMap(() =>
        this.authService.authorizeRequest().pipe(
          tap(({ token }) => localStorage.setItem('token', token)),
          map(() => AuthActions.getCurrentUser()),
        ),
      ),
    ),
  )

  getCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getCurrentUser),
      switchMap(() =>
        this.authService.getCurrentUser().pipe(
          map(({ user }) => AuthActions.getCurrentUserSuccess({ user })),
          catchError((error: Error) => {
            console.error(error)
            return of(AuthActions.getCurrentUserError({ error: error.message }))
          }),
        ),
      ),
    ),
  )

  isReturningUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.isReturningUser),
      switchMap(() =>
        this.authService.isReturningUser().pipe(
          tap(({ token }) => localStorage.setItem('token', token)),
          map(() => AuthActions.getCurrentUser()),
        ),
      ),
    ),
  )
}
