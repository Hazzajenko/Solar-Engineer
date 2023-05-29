import { getAllActions } from '@shared/utils'
import { AppStateActions } from '@canvas/app/data-access'
import { SelectedActions } from '@canvas/selected/data-access'
import { UiActions } from '@overlays/ui-store/data-access'
import { ObjectPositioningActions } from '@canvas/object-positioning/data-access'
import { GraphicsActions } from '@canvas/graphics/data-access'
import { KeysActions } from '@canvas/keys/data-access'
import {
	PanelConfigsActions,
	PanelLinksActions,
	PanelsActions,
	StringsActions,
} from '@entities/data-access'
import { Actions, createEffect, ofType, provideEffects } from '@ngrx/effects'
import { inject, makeEnvironmentProviders } from '@angular/core'
import { RenderService } from '@canvas/rendering/data-access'
import { tap } from 'rxjs'

const allStateActions = [
	...getAllActions(AppStateActions),
	...getAllActions(SelectedActions),
	...getAllActions(UiActions),
	...getAllActions(ObjectPositioningActions),
	...getAllActions(GraphicsActions),
	...getAllActions(KeysActions),
	...getAllActions(StringsActions),
	...getAllActions(PanelsActions),
	...getAllActions(PanelLinksActions),
	...getAllActions(PanelConfigsActions),
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

export function provideRenderingEffects() {
	return makeEnvironmentProviders([provideEffects({ renderCanvasOnStateChanges$ })])
}
