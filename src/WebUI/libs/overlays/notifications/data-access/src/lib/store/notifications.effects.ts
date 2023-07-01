import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, tap } from 'rxjs'
import { UsersSignalrService } from '@auth/data-access'
import { NotificationsActions } from './notifications.actions'
import { getTimeDifferenceFromNow } from '@shared/utils'
import { ProjectsActions } from '@entities/data-access'
import { createDynamicNotification } from '@auth/utils'
import { RenderService } from '@canvas/rendering/data-access'

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

export const displayLoadedLocalStorageNotification$ = createEffect(
	(actions$ = inject(Actions), renderService = inject(RenderService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.initLocalStorageProject),
			map(({ localStorageProject }) => {
				const lastModifiedTime = getTimeDifferenceFromNow(
					localStorageProject.lastModifiedTime,
					'short',
					true,
				)
				const dynamicNotification = createDynamicNotification({
					title: 'Loaded Local Save',
					subtitle: `Last Modified: ${lastModifiedTime}`,
					photoUrl: undefined,
					message: undefined,
					actionButton: undefined,
					dismissButton: {
						text: 'Dismiss',
						onClick: undefined,
					},
				})
				return NotificationsActions.addDynamicNotification({ dynamicNotification })
			}),
			tap(() => setTimeout(() => renderService.renderCanvasApp(), 10)),
		)
	},
	{ functional: true },
)
