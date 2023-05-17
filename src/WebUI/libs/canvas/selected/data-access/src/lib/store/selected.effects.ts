import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, tap } from 'rxjs'
import { RenderService } from '@canvas/rendering/data-access'
import { allSelectedActions, SelectedActions } from './selected.actions'
import { injectStringsStore } from '@entities/data-access'
import { ActionNotificationModel, NotificationsActions } from '@overlays/notifications/data-access'
import { getGuid } from '@ngrx/data'
import { assertNotNull } from '@shared/utils'

export const renderCanvasOnStateChange$ = createEffect(
	(actions$ = inject(Actions), renderService = inject(RenderService)) => {
		return actions$.pipe(
			ofType(...allSelectedActions),
			tap(() => {
				renderService.renderCanvasApp()
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const selectStringNotification$ = createEffect(
	(actions$ = inject(Actions), stringsStore = injectStringsStore()) => {
		return actions$.pipe(
			ofType(SelectedActions.selectString),
			map(({ stringId }) => {
				const string = stringsStore.getById(stringId)
				assertNotNull(string)
				const notification: ActionNotificationModel = {
					title: `${string.name} selected`,
					duration: 3000,
					type: 'info',
					id: `selected-string-${getGuid()}`,
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

/*
 export const SelectedEffects = {
 renderCanvasOnStateChange$,
 selectStringNotification$,
 }*/
