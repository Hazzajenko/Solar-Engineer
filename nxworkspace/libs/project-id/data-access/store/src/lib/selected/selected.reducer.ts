import { Action, createReducer, on } from '@ngrx/store'
import { SelectedActions } from './selected.actions'
import { TypeModel } from '@shared/data-access/models'
import { addPanelToMultiselect, addToMultiSelectArray } from './selected.helpers'

export const SELECTED_FEATURE_KEY = 'selected'

export interface SelectedState {
  type?: TypeModel
  multiSelectType?: TypeModel
  multiSelect?: boolean
  singleSelectId?: string
  multiSelectIds?: string[]
  selectedPositiveLinkTo?: string
  selectedNegativeLinkTo?: string
  selectedPanelId?: string
  selectedStringId?: string
  selectedStringTooltip?: string
  selectedStringPathMap?: Map<string, { link: number; count: number; color: string }>
}

export const initialSelectedState: SelectedState = {
  type: TypeModel.UNDEFINED,
  multiSelectType: TypeModel.UNDEFINED,
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

  on(SelectedActions.selectType, (state, { objectType }) => ({
    type: objectType,
    multiSelect: state.multiSelect,
    singleSelectId: undefined,
    multiSelectIds: undefined,
  })),

  on(SelectedActions.toggleMultiSelect, (state, { multiSelect }) => ({
    type: state.type,
    multiSelect,
    singleSelectId: state.singleSelectId,
    multiSelectIds: state.multiSelectIds,
  })),

  on(SelectedActions.selectId, (state, { id }) => ({
    type: state.type,
    multiSelect: false,
    singleSelectId: id,
    multiSelectIds: undefined,
  })),

  on(SelectedActions.selectMultiIds, (state, { ids }) => ({
    type: state.type,
    multiSelect: true,
    singleSelectId: undefined,
    multiSelectIds: ids,
  })),

  on(SelectedActions.selectPanel, (state, { panelId }) => ({
    type: TypeModel.PANEL,
    multiSelect: false,
    multiSelectIds: [],
    singleSelectId: panelId,
    selectedPanelId: panelId,
  })),

  on(SelectedActions.selectPanelWhenStringSelected, (state, { panelId }) => ({
    type: state.type,
    multiSelect: state.multiSelect,
    multiSelectIds: state.multiSelectIds,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    selectedStringTooltip: state.selectedStringTooltip,
    selectedStringPathMap: state.selectedStringPathMap,
    selectedPanelId: panelId,
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
    type: state.type,
    multiSelect: false,
    singleSelectId: state.singleSelectId,
    selectedPanelId: state.selectedPanelId,
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
  })),

  on(SelectedActions.setSelectedPanelLinksWhenStringSelected, (state, { panelLink }) => ({
    type: state.type,
    singleSelectId: state.singleSelectId,
    selectedPanelId: state.selectedPanelId,
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
    multiSelect: state.multiSelect,
    multiSelectIds: state.multiSelectIds,
    selectedStringId: state.selectedStringId,
    selectedStringTooltip: state.selectedStringTooltip,
    selectedStringPathMap: state.selectedStringPathMap,
  })),

  on(SelectedActions.selectString, (state, { stringId }) => ({
    type: TypeModel.STRING,
    singleSelectId: stringId,
    selectedStringId: stringId,
  })),

  // on(SelectedActions.selectDp, (state, { dpId }) => ({
  //   type: TypeModel.DISCONNECTIONPOINT,
  //   singleSelectId: dpId,
  // })),

  on(SelectedActions.setSelectedStringPanels, (state, { panelIds }) => ({
    type: TypeModel.STRING,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    multiSelectIds: panelIds,
  })),

  on(SelectedActions.setSelectedStringTooltip, (state, { tooltip }) => ({
    type: TypeModel.STRING,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    selectedStringTooltip: tooltip,
  })),

  on(SelectedActions.setSelectedStringLinkPaths, (state, { pathMap }) => ({
    type: TypeModel.STRING,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    selectedStringTooltip: state.selectedStringTooltip,
    selectedStringPathMap: pathMap,
  })),

  on(SelectedActions.clearSelectedPanelLinks, (state) => ({
    type: state.type,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    multiSelectIds: state.multiSelectIds,
    selectedStringTooltip: state.selectedStringTooltip,
    selectedStringPathMap: undefined,
  })),

  on(SelectedActions.clearSelectedState, () => ({
    type: TypeModel.UNDEFINED,
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
