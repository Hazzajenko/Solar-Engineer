import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { SelectedState } from './selected.reducer'
/*import {
 selectMultiSelectedEntities,
 selectSelectedPanelLinkId,
 selectSelectedState,
 selectSelectedStringId,
 selectSingleSelectedEntity,
 } from './selected.selectors'*/
import { SelectedActions } from './selected.actions'
import { selectedFeature } from './selected.feature'
import { PanelId, PanelLinkId, StringId } from '@entities/shared'

export function injectSelectedStore() {
	const store = inject(Store<SelectedState>)
	// const feature = selectedFeature
	const {
		selectSelectedState,
		selectSelectedStringId,
		selectSelectedPanelLinkId,
		selectSingleSelectedPanelId,
		selectMultipleSelectedPanelIds,
	} = selectedFeature

	return {
		get state() {
			return store.selectSignal(selectSelectedState)()
		},
		get state$() {
			return store.select(selectSelectedState)
		},
		get selectSingleSelectedPanelId() {
			return store.selectSignal(selectSingleSelectedPanelId)()
		},
		get singleSelectedPanelId$() {
			return store.select(selectSingleSelectedPanelId)
		},
		get multipleSelectedEntityIds$() {
			return store.select(selectMultipleSelectedPanelIds)
		},
		get selectMultipleSelectedPanelIds() {
			return store.selectSignal(selectMultipleSelectedPanelIds)()
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
		selectString(stringId: StringId) {
			store.dispatch(SelectedActions.selectString({ stringId }))
		},
		clearSelectedString() {
			store.dispatch(SelectedActions.clearSelectedString())
		},
		selectPanel(panelId: PanelId) {
			store.dispatch(SelectedActions.selectPanel({ panelId }))
		},
		selectMultipleEntities(panelIds: PanelId[]) {
			store.dispatch(SelectedActions.selectMultiplePanels({ panelIds }))
		},
		clearSingleSelected() {
			store.dispatch(SelectedActions.clearSingleSelected())
		},
		clearMultiSelected() {
			store.dispatch(SelectedActions.clearMultiSelected())
		},
		startMultiSelect(panelId: PanelId) {
			store.dispatch(SelectedActions.startPanelMultiSelect({ panelId }))
		},
		addPanelsToMultiSelect(panelIds: PanelId[]) {
			store.dispatch(SelectedActions.addPanelsToMultiSelect({ panelIds }))
		},
		removePanelsFromMultiSelect(panelIds: PanelId[]) {
			store.dispatch(SelectedActions.removePanelsFromMultiSelect({ panelIds }))
		},
		selectPanelLink(panelLinkId: PanelLinkId) {
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
