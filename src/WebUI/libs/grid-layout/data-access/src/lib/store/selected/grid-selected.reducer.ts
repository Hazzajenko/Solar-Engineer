import { GridSelectedActions } from './grid-selected.actions'
import { addPanelToMultiselect, addToMultiSelectArray } from './grid-selected.helpers'
import { Action, createReducer, on } from '@ngrx/store'
import { BLOCK_TYPE, BlockType, TypeModel } from '@shared/data-access/models'

export const GRID_SELECTED_FEATURE_KEY = 'grid-selected'

export interface SelectedState {
	type?: BlockType
	multiSelectType?: BlockType
	multiSelect?: boolean
	singleSelectId?: string
	multiSelectIds?: string[]
	selectedPositiveLinkTo?: string
	selectedNegativeLinkTo?: string
	selectedPanelId?: string
	selectedStringId?: string
	selectedStringTooltip?: string
	selectedStringPathMap?: undefined
	selectedPanelPathMap?: undefined
}

export const initialSelectedState: SelectedState = {
	type: BLOCK_TYPE.UNDEFINED,
	multiSelectType: BLOCK_TYPE.UNDEFINED,
	multiSelect: false,
	singleSelectId: undefined,
	multiSelectIds: [],
	selectedPositiveLinkTo: undefined,
	selectedNegativeLinkTo: undefined,
	selectedStringId: undefined,
	selectedStringTooltip: undefined,
	selectedStringPathMap: undefined,
	selectedPanelPathMap: undefined,
}

const reducer = createReducer(
	initialSelectedState,

	on(GridSelectedActions.toggleMultiSelect, (state, { multiSelect }) => ({
		...state,
		multiSelect,
	})),

	on(GridSelectedActions.selectId, (state, { id }) => ({
		...state,
		multiSelect: false,
		singleSelectId: id,
		multiSelectIds: undefined,
	})),

	on(GridSelectedActions.selectMultiIds, (state, { ids }) => ({
		...state,
		multiSelect: true,
		singleSelectId: undefined,
		multiSelectIds: ids,
	})),

	on(GridSelectedActions.selectPanel, (state, { panelId, panelLink }) => ({
		type: BLOCK_TYPE.PANEL,
		...state,
		singleSelectId: panelId,
		selectedPanelId: panelId,
		selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
		selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
	})),

	on(GridSelectedActions.selectPanelWhenStringSelected, (state, { panelId, panelLink }) => ({
		...state,
		singleSelectId: panelId,
		selectedPanelId: panelId,
		selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
		selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
	})),

	on(GridSelectedActions.startMultiSelectPanel, (state, { panelId }) => ({
		multiSelectUnit: TypeModel.PANEL,
		multiSelect: true,
		multiSelectIds: addToMultiSelectArray(panelId, state.multiSelectIds),
	})),

	on(GridSelectedActions.addPanelToMultiSelect, (state, { panelId }) => {
		return addPanelToMultiselect(panelId, state)
	}),

	// on(SelectedActions.selectTray, (state, { trayId }) => ({
	//   type: TypeModel.TRAY,
	//   multiSelect: false,
	//   singleSelectId: trayId,
	// })),

	on(GridSelectedActions.setSelectedPanelLinks, (state, { panelLink }) => ({
		...state,
		selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
		selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
	})),

	on(GridSelectedActions.setSelectedPanelLinksWhenStringSelected, (state, { panelLink }) => ({
		...state,
		selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
		selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
	})),

	on(GridSelectedActions.selectString, (state, { string }) => ({
		...state,
		selectedStringId: string.id, // multiSelectIds: panels.map(panel => panel.id),
	})),

	// on(SelectedActions.selectDp, (state, { dpId }) => ({
	//   type: TypeModel.DISCONNECTIONPOINT,
	//   singleSelectId: dpId,
	// })),

	on(GridSelectedActions.setSelectedStringPanels, (state, { panelIds }) => ({
		...state,
		multiSelectIds: panelIds,
	})),

	on(GridSelectedActions.setSelectedStringTooltip, (state, { tooltip }) => ({
		...state,
		selectedStringTooltip: tooltip,
	})),

	on(GridSelectedActions.setSelectedStringLinkPaths, (state, { pathMap }) => ({
		...state, // selectedStringPathMap: pathMap,
	})),

	on(GridSelectedActions.setSelectedPanelLinkPaths, (state, { pathMap }) => ({
		...state, // selectedPanelPathMap: pathMap,
	})),

	on(GridSelectedActions.clearSelectedPanelPathMap, (state) => ({
		...state,
		selectedPanelPathMap: undefined,
	})),

	on(GridSelectedActions.clearSelectedPanelLinks, (state) => ({
		...state,
		selectedStringPathMap: undefined,
	})),

	on(GridSelectedActions.clearSelectedSingleId, (state) => ({
		...state,
		singleSelectId: undefined,
		selectedPanelId: undefined,
		selectedPositiveLinkTo: undefined,
		selectedNegativeLinkTo: undefined,
	})),

	on(GridSelectedActions.clearSelectedState, () => ({
		type: BLOCK_TYPE.UNDEFINED,
		multiSelect: false,
		singleSelectId: undefined,
		multiSelectIds: [],
		selectedPositiveLinkTo: undefined,
		selectedNegativeLinkTo: undefined,
		typeToJoin: TypeModel.UNDEFINED,
		panelToJoin: undefined,
		dpToJoin: undefined,
	})),
)

export function gridSelectedReducer(state: SelectedState | undefined, action: Action) {
	return reducer(state, action)
}