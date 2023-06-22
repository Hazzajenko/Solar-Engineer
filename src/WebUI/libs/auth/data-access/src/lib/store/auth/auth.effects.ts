import { inject } from '@angular/core'
import { AuthService } from '../../api'
import { AuthActions } from './index'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { Location } from '@angular/common'
import { UsersSignalrService } from '../../signalr'
import { DeviceDetectorService } from 'ngx-device-detector'
import { DIALOG_COMPONENT, UiActions } from '@overlays/ui-store/data-access'

export const getRedirectForGoogleSignIn$ = createEffect(
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

export const getRedirectForGithubSignIn$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.signInWithGithub),
			map(() => {
				window.location.href = '/auth/login/github'
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const getRedirectForMicrosoftSignIn$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.signInWithMicrosoft),
			map(() => {
				window.location.href = '/auth/login/microsoft'
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
	(
		actions$ = inject(Actions),
		usersSignalr = inject(UsersSignalrService),
		deviceService = inject(DeviceDetectorService),
	) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			tap(({ token }) => {
				localStorage.setItem('token', token)
				const { device, deviceType, os } = deviceService.getDeviceInfo()
				const deviceInfo = { device, deviceType, os }
				usersSignalr.init(token, deviceInfo)
			}),
			map(() => {
				return UiActions.setScreenSize({
					screenSize: {
						width: window.innerWidth,
						height: window.innerHeight,
					},
				})
			}),
		)
	},
	{ functional: true },
)

export const signInError$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.signInError),
			tap(() => {
				localStorage.removeItem('token')
			}),
			map(() => {
				return UiActions.openDialog({
					dialog: {
						component: DIALOG_COMPONENT.SIGN_IN,
					},
				})
			}),
		)
	},
	{ functional: true },
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
