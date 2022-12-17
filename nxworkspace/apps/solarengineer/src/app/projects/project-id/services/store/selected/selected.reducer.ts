import { createReducer, on } from '@ngrx/store'
import { SelectedStateActions } from './selected.actions'
import { TypeModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/type.model'
import { addPanelToMultiselect, addToMultiSelectArray } from './selected.helpers'

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
  selectedStringPathMapCoords?: Map<string, { x: number; y: number }>
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
  selectedStringPathMapCoords: undefined,
}

export const selectedReducer = createReducer(
  initialSelectedState,

  on(SelectedStateActions.selectType, (state, { objectType }) => ({
    type: objectType,
    multiSelect: state.multiSelect,
    singleSelectId: undefined,
    multiSelectIds: undefined,
  })),

  on(SelectedStateActions.toggleMultiSelect, (state, { multiSelect }) => ({
    type: state.type,
    multiSelect,
    singleSelectId: state.singleSelectId,
    multiSelectIds: state.multiSelectIds,
  })),

  on(SelectedStateActions.selectId, (state, { id }) => ({
    type: state.type,
    multiSelect: false,
    singleSelectId: id,
    multiSelectIds: undefined,
  })),

  on(SelectedStateActions.selectMultiIds, (state, { ids }) => ({
    type: state.type,
    multiSelect: true,
    singleSelectId: undefined,
    multiSelectIds: ids,
  })),

  on(SelectedStateActions.selectPanel, (state, { panelId }) => ({
    type: TypeModel.PANEL,
    multiSelect: false,
    multiSelectIds: [],
    singleSelectId: panelId,
    selectedPanelId: panelId,
  })),

  on(SelectedStateActions.selectPanelWhenStringSelected, (state, { panelId }) => ({
    type: state.type,
    multiSelect: state.multiSelect,
    multiSelectIds: state.multiSelectIds,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    selectedStringTooltip: state.selectedStringTooltip,
    selectedStringPathMap: state.selectedStringPathMap,
    selectedPanelId: panelId,
  })),

  on(SelectedStateActions.startMultiselectPanel, (state, { panelId }) => ({
    multiSelectUnit: TypeModel.PANEL,
    multiSelect: true,
    multiSelectIds: addToMultiSelectArray(panelId, state.multiSelectIds),
  })),

  on(SelectedStateActions.addPanelToMultiselect, (state, { panelId }) => {
    return addPanelToMultiselect(panelId, state)
  }),

  on(SelectedStateActions.selectCable, (state, { cableId }) => ({
    type: TypeModel.CABLE,
    multiSelect: false,
    singleSelectId: cableId,
  })),

  on(SelectedStateActions.selectTray, (state, { trayId }) => ({
    type: TypeModel.TRAY,
    multiSelect: false,
    singleSelectId: trayId,
  })),

  on(SelectedStateActions.selectRail, (state, { railId }) => ({
    type: TypeModel.RAIL,
    multiSelect: false,
    singleSelectId: railId,
  })),

  on(SelectedStateActions.setSelectedPanelLinks, (state, { panelLink }) => ({
    type: state.type,
    multiSelect: false,
    singleSelectId: state.singleSelectId,
    selectedPanelId: state.selectedPanelId,
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
  })),

  on(SelectedStateActions.setSelectedPanelLinksWhenStringSelected, (state, { panelLink }) => ({
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

  on(SelectedStateActions.selectString, (state, { stringId }) => ({
    type: TypeModel.STRING,
    singleSelectId: stringId,
    selectedStringId: stringId,
  })),

  on(SelectedStateActions.selectDp, (state, { dpId }) => ({
    type: TypeModel.DISCONNECTIONPOINT,
    singleSelectId: dpId,
  })),

  on(SelectedStateActions.setSelectedStringPanels, (state, { panelIds }) => ({
    type: TypeModel.STRING,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    // multiSelectIds: panelIds,
  })),

  on(SelectedStateActions.setSelectedStringTooltip, (state, { tooltip }) => ({
    type: TypeModel.STRING,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    selectedStringTooltip: tooltip,
  })),

  on(SelectedStateActions.setSelectedStringLinkPaths, (state, { pathMap }) => ({
    type: TypeModel.STRING,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    selectedStringTooltip: state.selectedStringTooltip,
    selectedStringPathMap: pathMap,
  })),

  /*  on(SelectedStateActions.setSelectedStringLinkPathCoords, (state, { panelId, x, y }) => ({
      type: TypeModel.STRING,
      singleSelectId: state.singleSelectId,
      selectedStringId: state.selectedStringId,
      multiSelectIds: state.multiSelectIds,
      selectedStringTooltip: state.selectedStringTooltip,
      selectedStringPathMap: state.selectedStringPathMap,
      selectedStringPathMapCoords: addToMap(panelId, x, y, state.selectedStringPathMapCoords),
    })),*/

  on(SelectedStateActions.clearSelectedPanelLinks, (state) => ({
    type: state.type,
    singleSelectId: state.singleSelectId,
    selectedStringId: state.selectedStringId,
    multiSelectIds: state.multiSelectIds,
    selectedStringTooltip: state.selectedStringTooltip,
    selectedStringPathMap: undefined,
  })),

  on(SelectedStateActions.clearSelectedState, () => ({
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
