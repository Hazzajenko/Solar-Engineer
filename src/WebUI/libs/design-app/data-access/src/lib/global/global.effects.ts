import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { getAllActions } from '@shared/utils'

import { SelectedActions } from '../selected'
import { PanelsActions, StringsActions } from '../entities'
import { UiActions } from '../ui-store'
import { ObjectPositioningActions } from '../object-positioning-store'
import { GraphicsActions } from '../graphics-store'
import { KeysActions } from '../keys'
import { RenderService } from '../render'
import { PanelLinksActions } from '../panel-links'

const allStateActions = [
	...getAllActions(StringsActions),
	...getAllActions(PanelsActions),
	...getAllActions(PanelLinksActions),
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
