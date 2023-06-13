import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { UsersSignalrService } from '@auth/data-access'
import { NotificationsActions } from './notifications.actions'

export const markNotificationsAsRead = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(NotificationsActions.markManyNotificationsAsRead),
			tap(({ notificationIds }) => {
				usersSignalr.readManyNotifications(notificationIds)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const markNotificationsAsCompleted = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(NotificationsActions.markNotificationsAsCompleted),
			tap(({ notificationIds }) => {
				usersSignalr.completeManyNotifications(notificationIds)
			}),
		)
	},
	{ functional: true, dispatch: false },
)
