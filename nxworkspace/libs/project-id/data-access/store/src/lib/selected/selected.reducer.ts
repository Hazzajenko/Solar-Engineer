import { StringPathMap } from '@grid-layout/shared/models'
import { Action, createReducer, on } from '@ngrx/store'
import { SelectedActions } from './selected.actions'
import { BlockType, TypeModel } from '@shared/data-access/models'
import { addPanelToMultiselect, addToMultiSelectArray } from './selected.helpers'

export const SELECTED_FEATURE_KEY = 'selected'

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
  selectedStringPathMap?: StringPathMap
}

export const initialSelectedState: SelectedState = {
  type: BlockType.UNDEFINED,
  multiSelectType: BlockType.UNDEFINED,
  multiSelect: false,
  singleSelectId: undefined,
  multiSelectIds: [],
  selectedPositiveLinkTo: undefined,
  selectedNegativeLinkTo: undefined,
  selectedStringId: undefined,
  selectedStringTooltip: undefined,
  selectedStringPathMap: undefined,
}

const reducer = createReducer(
  initialSelectedState,

  on(SelectedActions.toggleMultiSelect, (state, { multiSelect }) => ({
    ...state,
    multiSelect,
  })),

  on(SelectedActions.selectId, (state, { id }) => ({
    ...state,
    multiSelect: false,
    singleSelectId: id,
    multiSelectIds: undefined,
  })),

  on(SelectedActions.selectMultiIds, (state, { ids }) => ({
    ...state,
    multiSelect: true,
    singleSelectId: undefined,
    multiSelectIds: ids,
  })),

  on(SelectedActions.selectPanel, (state, { panelId, panelLink }) => ({
    type: BlockType.PANEL,
    ...state,
    singleSelectId: panelId,
    selectedPanelId: panelId,
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
  })),

  on(SelectedActions.selectPanelWhenStringSelected, (state, { panelId, panelLink }) => ({
    ...state,
    singleSelectId: panelId,
    selectedPanelId: panelId,
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
  })),

  on(SelectedActions.startMultiselectPanel, (state, { panelId }) => ({
    multiSelectUnit: TypeModel.PANEL,
    multiSelect: true,
    multiSelectIds: addToMultiSelectArray(panelId, state.multiSelectIds),
  })),

  on(SelectedActions.addPanelToMultiselect, (state, { panelId }) => {
    return addPanelToMultiselect(panelId, state)
  }),

  // on(SelectedActions.selectTray, (state, { trayId }) => ({
  //   type: TypeModel.TRAY,
  //   multiSelect: false,
  //   singleSelectId: trayId,
  // })),

  on(SelectedActions.setSelectedPanelLinks, (state, { panelLink }) => ({
    ...state,
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
  })),

  on(SelectedActions.setSelectedPanelLinksWhenStringSelected, (state, { panelLink }) => ({
    ...state,
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
  })),

  on(SelectedActions.selectString, (state, { string }) => ({
    ...state,
    selectedStringId: string.id,
    // multiSelectIds: panels.map(panel => panel.id),
  })),

  // on(SelectedActions.selectDp, (state, { dpId }) => ({
  //   type: TypeModel.DISCONNECTIONPOINT,
  //   singleSelectId: dpId,
  // })),

  on(SelectedActions.setSelectedStringPanels, (state, { panelIds }) => ({
    ...state,
    multiSelectIds: panelIds,
  })),

  on(SelectedActions.setSelectedStringTooltip, (state, { tooltip }) => ({
    ...state,
    selectedStringTooltip: tooltip,
  })),

  on(SelectedActions.setSelectedStringLinkPaths, (state, { pathMap }) => ({
    ...state,
    selectedStringPathMap: pathMap,
  })),

  on(SelectedActions.clearSelectedPanelLinks, (state) => ({
    ...state,
    selectedStringPathMap: undefined,
  })),

  on(SelectedActions.clearSelectedSingleId, (state) => ({
    ...state,
    singleSelectId: undefined,
    selectedPanelId: undefined,
    selectedPositiveLinkTo: undefined,
    selectedNegativeLinkTo: undefined,
  })),

  on(SelectedActions.clearSelectedState, () => ({
    type: BlockType.UNDEFINED,
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

export function selectedReducer(state: SelectedState | undefined, action: Action) {
  return reducer(state, action)
}
