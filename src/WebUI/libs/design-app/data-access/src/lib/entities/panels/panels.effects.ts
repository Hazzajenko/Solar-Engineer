import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map } from 'rxjs'
import { PanelsActions } from './panels.actions'
import { SelectedActions, SelectedStoreService } from '../../selected'

export const removeSelectedIfDeleted$ = createEffect(
	(actions$ = inject(Actions), selectedStore = inject(SelectedStoreService)) => {
		return actions$.pipe(
			ofType(PanelsActions.deletePanel),
			map(({ panelId }) => {
				const selected = selectedStore.singleSelectedEntityId
				if (selected === panelId) {
					return SelectedActions.clearSingleSelected()
				}
				const multiSelectedIds = selectedStore.multipleSelectedEntityIds
				if (multiSelectedIds.includes(panelId)) {
					return SelectedActions.removeEntitiesFromMultiSelect({ entityIds: [panelId] })
				}
				return SelectedActions.noop()
			}),
		)
	},
	{ functional: true },
)
