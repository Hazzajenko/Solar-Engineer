import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { SelectedActions } from '@canvas/selected/data-access'
import { map, switchMap } from 'rxjs'
import { getDefaultBoundsBoxFromMultipleEntities } from '@canvas/utils'
import { Store } from '@ngrx/store'
import { selectPanelsByIdArray, selectPanelsByStringId } from '@entities/data-access'

export const setMultipleSelectedPanelsBounds = createEffect(
	(actions$ = inject(Actions), store = inject(Store)) => {
		return actions$.pipe(
			ofType(SelectedActions.selectMultiplePanels),
			switchMap(({ panelIds }) => store.select(selectPanelsByIdArray({ ids: panelIds }))),
			map((multipleSelectedPanels) => {
				if (multipleSelectedPanels.length < 2) {
					return SelectedActions.noop()
				}
				const bounds = getDefaultBoundsBoxFromMultipleEntities(multipleSelectedPanels)
				return SelectedActions.setSelectedPanelsBoxBounds({ bounds })
			}),
		)
	},
	{ functional: true },
)

export const setSelectedStringPanelsBounds = createEffect(
	(actions$ = inject(Actions), store = inject(Store)) => {
		return actions$.pipe(
			ofType(SelectedActions.selectString),
			switchMap(({ stringId }) => store.select(selectPanelsByStringId({ stringId }))),
			map((selectedStringPanels) => {
				const bounds = getDefaultBoundsBoxFromMultipleEntities(selectedStringPanels)
				return SelectedActions.setSelectedStringBoxBounds({ bounds })
			}),
		)
	},
	{ functional: true },
)
