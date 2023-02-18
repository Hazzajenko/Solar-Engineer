import { inject, Injectable } from '@angular/core'
import { AuthService } from '../api/auth.service'
import { AuthActions } from '../store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { Location } from '@angular/common'

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private location = inject(Location)
  private authService = inject(AuthService)

  getRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginWithGoogle),
        tap(() => {
          window.location.href = '/identity/login/google'
          // window.location.href = '/auth/login/google'
          // this.location.go('/auth/login/google')
          // window.location.reload()
        }),
        /*        switchMap(() =>
                  this.authService.loginWithGoogle()
                  // this.authService.loginWithGoogle()
                ),*/
      ),
    { dispatch: false },
  )

  authorizeRequest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authorizeRequest),
        switchMap(
          () =>
            this.authService
              .authorizeRequest()
              .pipe(map((res) => localStorage.setItem('token', res.token))),
          // this.authService.loginWithGoogle()
        ),
      ),
    { dispatch: false },
  )

  /*    login$ = createEffect(() =>
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
      )*/
}
