import { Store } from '@ngrx/store'
import { SelectedActions } from './selected.actions'
import { selectedFeature } from './selected.feature'
import { PanelId, PanelLinkId, StringId } from '@entities/shared'
import { createRootServiceInjector } from '@shared/utils'
import { TransformedPoint } from '@shared/data-access/models'

export function injectSelectedStore(): SelectedStore {
	return selectedStoreInjector()
}

const selectedStoreInjector = createRootServiceInjector(selectedStoreFactory, {
	deps: [Store],
})

export type SelectedStore = ReturnType<typeof selectedStoreFactory>

function selectedStoreFactory(store: Store) {
	const {
		selectSelectedState,
		selectSelectedStringId,
		selectSelectedPanelLinkId,
		selectSingleSelectedPanelId,
		selectMultipleSelectedPanelIds,
		selectEntityState,
		selectSelectedPanelsBoxBounds,
		selectSelectedStringBoxBounds,
		selectIsPointInsideSelectedPanelsBoxBounds,
		selectIsPointInsideSelectedStringBoxBounds,
	} = selectedFeature

	const select = {
		selectedState: store.selectSignal(selectSelectedState),
		selectedStringId: store.selectSignal(selectSelectedStringId),
		selectedPanelLinkId: store.selectSignal(selectSelectedPanelLinkId),
		singleSelectedPanelId: store.selectSignal(selectSingleSelectedPanelId),
		multipleSelectedPanelIds: store.selectSignal(selectMultipleSelectedPanelIds),
		entityState: store.selectSignal(selectEntityState),
		selectedPanelsBoxBounds: store.selectSignal(selectSelectedPanelsBoxBounds),
		selectedStringBoxBounds: store.selectSignal(selectSelectedStringBoxBounds),
		isPointInsideSelectedPanelsBoxBounds: (point: TransformedPoint) =>
			store.selectSignal(selectIsPointInsideSelectedPanelsBoxBounds(point))(),
		isPointInsideSelectedStringBoxBounds: (point: TransformedPoint) =>
			store.selectSignal(selectIsPointInsideSelectedStringBoxBounds(point))(),
	}

	const dispatch = {
		selectStringId: (stringId: StringId) =>
			store.dispatch(SelectedActions.selectString({ stringId })),
		selectPanelLinkId: (panelLinkId: PanelLinkId) =>
			store.dispatch(SelectedActions.selectPanelLink({ panelLinkId })),
		selectPanel: (panelId: PanelId) => store.dispatch(SelectedActions.selectPanel({ panelId })),
		selectMultiplePanels: (panelIds: PanelId[]) =>
			store.dispatch(SelectedActions.selectMultiplePanels({ panelIds })),
		clearSelectedString: () => store.dispatch(SelectedActions.clearSelectedString()),
		clearSelectedPanel: () => store.dispatch(SelectedActions.clearSingleSelected()),
		clearSingleSelected: () => store.dispatch(SelectedActions.clearSingleSelected()),
		clearMultipleSelected: () => store.dispatch(SelectedActions.clearMultiSelected()),
		addPanelsToMultiSelect: (panelIds: PanelId[]) =>
			store.dispatch(SelectedActions.addPanelsToMultiSelect({ panelIds })),
		removePanelsFromMultiSelect: (panelIds: PanelId[]) =>
			store.dispatch(SelectedActions.removePanelsFromMultiSelect({ panelIds })),
		selectPanelLink: (panelLinkId: PanelLinkId) =>
			store.dispatch(SelectedActions.selectPanelLink({ panelLinkId })),
		clearSelectedPanelLink: () => store.dispatch(SelectedActions.clearSelectedPanelLink()),
		clearSelectedState: () => store.dispatch(SelectedActions.clearSelectedState()),
	}

	return {
		select,
		dispatch /*	get state() {
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
		 },*/,
	}
}
