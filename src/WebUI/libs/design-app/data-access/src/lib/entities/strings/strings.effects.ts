import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map } from 'rxjs'
import { StringsActions } from './strings.actions'
import { getGuid } from '@ngrx/data'
import { ActionNotificationModel, NotificationsActions } from '../../notifications'

export const createStringNotification$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(StringsActions.addString),
			map(({ string }) => {
				const notification: ActionNotificationModel = {
					title: `${string.name} added`,
					message: 'String added',
					duration: 3000,
					type: 'success',
					id: `string-added-${getGuid()}`,
					isOpen: true,
					buttons: [
						{
							text: 'Undo',
							action: () => {
								console.log('undo')
							},
						},
					],
				}
				return NotificationsActions.addNotification({ notification })
			}),
		)
	},
	{ functional: true },
)
