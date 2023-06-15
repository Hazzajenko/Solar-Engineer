import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, of, switchMap } from 'rxjs'
import { LocalNotificationModel, WebUserModel } from '@auth/shared'
import { Store } from '@ngrx/store'
import { HttpClient } from '@angular/common/http'
import { newGuid } from '@shared/utils'
import { NotificationsActions } from '@overlays/notifications/data-access'
import { ConnectionsActions } from './connections.actions'
import { selectUserById, UsersActions } from '../users'

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
							return http.get<WebUserModel>(`/api/user/${connection.appUserId}`).pipe(
								map((user) => {
									if (user) return UsersActions.addAppUser({ user })
									throw new Error('User not found')
								}),
							)
						}),
					)
					.pipe(
						map((userOrAction) => {
							const user = 'type' in userOrAction ? userOrAction.user : userOrAction
							const localNotification: LocalNotificationModel = {
								id: newGuid(),
								notificationType: 'UserIsOnline',
								completed: true,
								senderAppUserId: user.id,
								senderAppUserUserName: user.userName,
								senderAppUserDisplayName: user.displayName,
								senderAppUserPhotoUrl: user.photoUrl,
							}
							return NotificationsActions.addLocalNotification({ localNotification })
						}),
					)
			}),
		)
	},
	{ functional: true },
)
