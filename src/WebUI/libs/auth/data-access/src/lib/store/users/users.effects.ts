import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { UsersActions } from './users.actions'
import { UsersSignalrService } from '../../signalr'

export const searchForUsers$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.searchForAppUserByUserName),
			tap(({ query }) => {
				usersSignalr.searchForAppUserByUserName(query)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const sendFriendRequest$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.sendFriendRequest),
			tap(({ userId }) => {
				usersSignalr.sendFriendRequest(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const acceptFriendRequest$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.acceptFriendRequest),
			tap(({ userId }) => {
				usersSignalr.acceptFriendRequest(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const rejectFriendRequest$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.rejectFriendRequest),
			tap(({ userId }) => {
				usersSignalr.rejectFriendRequest(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const removeFriend$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.removeFriend),
			tap(({ userId }) => {
				usersSignalr.removeFriend(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)
