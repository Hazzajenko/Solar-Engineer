import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { getAllActions } from '@shared/utils'

import { SelectedActions } from '@canvas/selected/data-access'
import { UiActions } from '@overlays/ui-store/data-access'
import { ObjectPositioningActions } from '@canvas/object-positioning/data-access'
import { GraphicsActions } from '@canvas/graphics/data-access'
import { KeysActions } from '@canvas/keys/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { AppStateActions } from '../store'

const allStateActions = [
	...getAllActions(AppStateActions),
	...getAllActions(SelectedActions),
	...getAllActions(UiActions),
	...getAllActions(ObjectPositioningActions),
	...getAllActions(GraphicsActions),
	...getAllActions(KeysActions),
]
export const renderCanvasOnStateChanges$ = createEffect(
	(actions$ = inject(Actions), renderService = inject(RenderService)) => {
		return actions$.pipe(
			ofType(...allStateActions),
			tap(() => {
				renderService.renderCanvasApp()
			}),
		)
	},
	{ functional: true, dispatch: false },
)
