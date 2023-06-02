import { inject } from '@angular/core'
import { AuthService } from '../api'
import { AuthActions } from './index'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { Location } from '@angular/common'

export const getRedirect$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.loginWithGoogle),
			map(() => {
				window.location.href = '/auth/login/google'
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const authorizeRequest$ = createEffect(
	(actions$ = inject(Actions), _auth = inject(AuthService)) => {
		return actions$.pipe(
			ofType(AuthActions.authorizeRequest),
			switchMap(() => _auth.authorizeRequest()),
			map((res) => AuthActions.signInSuccess({ ...res })),
			catchError((error: string | null) => of(AuthActions.signInError({ error }))),
		)
	},
	{ functional: true },
)

export const isReturningUser$ = createEffect(
	(actions$ = inject(Actions), _auth = inject(AuthService)) => {
		return actions$.pipe(
			ofType(AuthActions.isReturningUser),
			switchMap(() => _auth.isReturningUser()),
			map((res) => AuthActions.signInSuccess({ ...res })),
			catchError((error: string | null) => of(AuthActions.signInError({ error }))),
		)
	},
	{ functional: true },
)

export const signInSuccess$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			tap(({ token }) => localStorage.setItem('token', token)),
		)
	},
	{ functional: true, dispatch: false },
)

export const backToPreviousPage$ = createEffect(
	(actions$ = inject(Actions), _location = inject(Location)) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			tap(() => {
				const previousUrl = localStorage.getItem('previousUrl')
				if (previousUrl) {
					localStorage.removeItem('previousUrl')
					_location.go(previousUrl)
					return
				}
				_location.go('/')
				// _location.back()
			}),
		)
	},
	{ functional: true, dispatch: false },
)
/*

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
 ofType(AuthActions.loginWithGoogle), // switchMap(() => this.http.get('/auth-services/login/google')),
 map(() => {
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

 /!*  signInSuccess$ = createEffect(() =>
 this.actions$.pipe(
 ofType(AuthActions.signInSuccess),
 tap(() => {
 this.router
 .navigateByUrl('')
 .then()
 .catch((err) => console.error(err))
 }),
 ),
 )*!/

 /!*  connectToSignalR$ = createEffect(() =>
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
 )*!/

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
 */
