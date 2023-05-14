import { SelectedActions, SelectedStoreService } from '@canvas/selected/data-access'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions } from './panels.actions'
import { map } from 'rxjs'

/*export const removeSelectedIfDeleted$ = createEffect(
 (actions$ = inject(Actions), store = inject(Store)) => {
 return actions$.pipe(
 ofType(PanelsActions.deletePanel),
 map(({ panelId }) => {
 // const selected = store.selectSignal(state => state.selected.singleSelectedEntityId)
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
 )*/

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
