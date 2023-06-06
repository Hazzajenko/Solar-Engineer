import { inject } from '@angular/core'
import { AuthService } from '../api'
import { AuthActions } from './index'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { Location } from '@angular/common'
import { ConnectionsSignalrService } from '../signalr'

export const getRedirect$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.signInWithGoogle),
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
	(actions$ = inject(Actions), connectionsSignalr = inject(ConnectionsSignalrService)) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			tap(({ token }) => {
				localStorage.setItem('token', token)
				connectionsSignalr.init(token)
			}),
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

export const signOut$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.signOut),
			tap(() => {
				localStorage.removeItem('token')
			}),
		)
	},
	{ functional: true, dispatch: false },
)
