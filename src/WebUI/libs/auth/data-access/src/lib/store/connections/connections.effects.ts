import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, of, switchMap } from 'rxjs'
import { WebUserModel } from '@auth/shared'
import { Store } from '@ngrx/store'
import { HttpClient } from '@angular/common/http'
import { NotificationsActions } from '@overlays/notifications/data-access'
import { ConnectionsActions } from './connections.actions'
import { selectUserById, UsersActions } from '../users'
import { createLocalNotification } from '@auth/utils'

export const userIsOnlineDispatchNotification$ = createEffect(
	(actions$ = inject(Actions), http = inject(HttpClient), store = inject(Store)) => {
		return actions$.pipe(
			ofType(ConnectionsActions.addConnection),
			switchMap(({ connection }) => {
				return store
					.select(selectUserById({ id: connection.appUserId }))
					.pipe(
						switchMap((user) => {
							if (user) return of(user)
							return http.get<WebUserModel>(`/auth/user/${connection.appUserId}`).pipe(
								map((user) => {
									if (user) return UsersActions.addUser({ user })
									throw new Error('User not found')
								}),
							)
						}),
					)
					.pipe(
						map((userOrAction) => {
							const user = 'type' in userOrAction ? userOrAction.user : userOrAction
							if (user.isOnline) {
								return NotificationsActions.addLocalNotification({
									localNotification: createLocalNotification.userIsOnline(user),
								})
							}
							// const localNotification = createLocalNotification.userIsOnline(user)
							return NotificationsActions.noop()
						}),
					)
			}),
		)
	},
	{ functional: true },
)
