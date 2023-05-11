import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { RenderService } from '../render'
import { allSelectedActions } from './selected.actions'

/*const allSelectedActions = [
 SelectedActions.selectEntity,
 SelectedActions.selectMultipleEntities,
 SelectedActions.selectString,
 SelectedActions.addEntitiesToMultiSelect,
 SelectedActions.removeEntitiesFromMultiSelect,
 SelectedActions.startMultiSelect,
 SelectedActions.clearSelectedState,
 SelectedActions.clearSingleSelected,
 SelectedActions.clearMultiSelected,
 ]

 const actions = Object.keys(SelectedActions).map(
 (key) => SelectedActions[key as keyof typeof SelectedActions],
 )*/
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
