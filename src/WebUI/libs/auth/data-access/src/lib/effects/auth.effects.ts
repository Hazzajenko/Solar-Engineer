import { inject, Injectable } from '@angular/core'
import { AuthService } from '../api/auth.service'
import { AuthActions } from '../store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { Location } from '@angular/common'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private location = inject(Location)
  private authService = inject(AuthService)
  private http = inject(HttpClient)
  headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'https://localhost:6006')
  // .set('content-type', 'application/json')

  // y: No 'Access-Control-Allow-Origin' header is present

  /*  const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');*/
  getRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginWithGoogle),
        /*        switchMap(() =>
                  this.http.get('/identity/login/google', { headers: this.headers, withCredentials: true }),
                ),*/
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
        switchMap(() =>
          this.authService.authorizeRequest().pipe(
            tap((res) => console.log(res)),
            tap((res) => console.log(res.accessToken)),
            tap((res) =>
              localStorage.setItem('token', res.accessToken),
            ) /*.pipe(map(() => AuthActions.getToken())),*/,
            // .pipe(map((res) => localStorage.setItem('token', res.token))),
            // this.authService.loginWithGoogle()
          ),
        ),
      ),
    { dispatch: false },
  )
  /*
    authorizeRequest$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.authorizeRequest),
          switchMap(
            () => this.authService.authorizeRequest().pipe(map(() => AuthActions.getToken())),
            // .pipe(map((res) => localStorage.setItem('token', res.token))),
            // this.authService.loginWithGoogle()
          ),
        ),
      // { dispatch: false },
    )*/

  getToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.getToken),
        switchMap(
          () =>
            this.authService.getToken().pipe(
              tap((res) => console.log(res)),
              tap((res) => localStorage.setItem('token', JSON.stringify(res.accessToken))),
              // map((res) => localStorage.setItem('token', res.accessToken)),
            ),
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
