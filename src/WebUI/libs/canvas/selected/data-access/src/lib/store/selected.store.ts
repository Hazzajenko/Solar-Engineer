import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { SelectedState } from './selected.reducer'
import {
	selectMultiSelectedEntities,
	selectSelectedPanelLinkId,
	selectSelectedState,
	selectSelectedStringId,
	selectSingleSelectedEntity,
} from './selected.selectors'
import { SelectedActions } from './selected.actions'

export function injectSelectedStore() {
	const store = inject(Store<SelectedState>)

	return {
		get state() {
			return store.selectSignal(selectSelectedState)()
		},
		get state$() {
			return store.select(selectSelectedState)
		},
		get singleSelectedEntityId() {
			return store.selectSignal(selectSingleSelectedEntity)()
		},
		get singleSelectedEntityId$() {
			return store.select(selectSingleSelectedEntity)
		},
		get multipleSelectedEntityIds$() {
			return store.select(selectMultiSelectedEntities)
		},
		get multipleSelectedEntityIds() {
			return store.selectSignal(selectMultiSelectedEntities)()
		},
		get selectedStringId() {
			return store.selectSignal(selectSelectedStringId)()
		},
		get selectedStringId$() {
			return store.select(selectSelectedStringId)
		},
		get selectedPanelLinkId() {
			return store.selectSignal(selectSelectedPanelLinkId)()
		},
		get selectedPanelLinkId$() {
			return store.select(selectSelectedPanelLinkId)
		},
		selectString(stringId: string) {
			store.dispatch(SelectedActions.selectString({ stringId }))
		},
		clearSelectedString() {
			store.dispatch(SelectedActions.clearSelectedString())
		},
		selectEntity(entityId: string) {
			store.dispatch(SelectedActions.selectEntity({ entityId }))
		},
		selectMultipleEntities(entityIds: string[]) {
			store.dispatch(SelectedActions.selectMultipleEntities({ entityIds }))
		},
		clearSingleSelected() {
			store.dispatch(SelectedActions.clearSingleSelected())
		},
		clearMultiSelected() {
			store.dispatch(SelectedActions.clearMultiSelected())
		},
		startMultiSelect(entityId: string) {
			store.dispatch(SelectedActions.startMultiSelect({ entityId }))
		},
		addEntitiesToMultiSelect(entityIds: string[]) {
			store.dispatch(SelectedActions.addEntitiesToMultiSelect({ entityIds }))
		},
		removeEntitiesFromMultiSelect(entityIds: string[]) {
			store.dispatch(SelectedActions.removeEntitiesFromMultiSelect({ entityIds }))
		},
		selectPanelLink(panelLinkId: string) {
			store.dispatch(SelectedActions.selectPanelLink({ panelLinkId }))
		},
		clearPanelLink() {
			store.dispatch(SelectedActions.clearSelectedPanelLink())
		},
		clearSelectedState() {
			store.dispatch(SelectedActions.clearSelectedState())
		},
	}
}

export type SelectedStore = ReturnType<typeof injectSelectedStore>
