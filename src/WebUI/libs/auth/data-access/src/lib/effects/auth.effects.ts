import { inject, Injectable } from '@angular/core'
import { AuthService } from '../api'
import { AuthActions } from '../store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)
  private router = inject(Router)
  private location = inject(Location)
  private http = inject(HttpClient)

  getRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginWithGoogle),
        // switchMap(() => this.http.get('/auth-services/login/google')),
        map(() => {
          window.location.href = '/auth-api/login/google'
        }),
      ),
    { dispatch: false },
  )

  authorizeRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authorizeRequest),
      switchMap(() =>
        this.authService.authorizeRequest().pipe(
          // tap(({ token }) => localStorage.setItem('token', token)),
          map(({ token, user }) => {
            localStorage.setItem('token', token)
            return AuthActions.signInFetchUserSuccess({ token, user })
            // return AuthActions.signInSuccess({ token })
          }),
        ),
      ),
    ),
  )

  backToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        map(() => {
          // window.location.href = ''
          this.location.go('/')
        }),
      ),
    { dispatch: false },
  )

  /*  signInSuccess$ = createEffect(() =>
   this.actions$.pipe(
   ofType(AuthActions.signInSuccess),
   tap(() => {
   this.router
   .navigateByUrl('')
   .then()
   .catch((err) => console.error(err))
   }),
   ),
   )*/

  /*  connectToSignalR$ = createEffect(() =>
   this.actions$.pipe(
   ofType(AuthActions.signInSuccess),
   /!*      tap(
   () => {
   this.router
   .navigateByUrl('')
   .then()
   .catch((err) => console.error(err))
   },
   ),*!/
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
   )*/

  getCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      switchMap(({ token }) =>
        this.authService.getCurrentUser(token).pipe(
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
          map(({ token }) => AuthActions.signInSuccess({ token })),
        ),
      ),
    ),
  )
}
