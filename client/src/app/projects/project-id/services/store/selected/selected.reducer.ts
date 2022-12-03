import { createReducer, on } from '@ngrx/store'
import { SelectedStateActions } from './selected.actions'
import { UnitModel } from '../../../../models/unit.model'
import {
  addPanelToMultiselect,
  addToMultiSelectArray,
} from './selected.helpers'

export interface SelectedState {
  unit?: UnitModel
  multiSelectUnit?: UnitModel
  multiSelect?: boolean
  singleSelectId?: string
  multiSelectIds?: string[]
  selectedPositiveLinkTo?: string
  selectedNegativeLinkTo?: string
  selectedStringId?: string
  selectedStringTooltip?: string
}

function bringBackArray(hello?: string[]): string[] {
  if (hello) return hello
  return []
}

export const initialSelectedState: SelectedState = {
  unit: UnitModel.UNDEFINED,
  multiSelectUnit: UnitModel.UNDEFINED,
  multiSelect: false,
  singleSelectId: undefined,
  multiSelectIds: [],
  selectedPositiveLinkTo: undefined,
  selectedNegativeLinkTo: undefined,
  selectedStringId: undefined,
  selectedStringTooltip: undefined,
}

export const selectedReducer = createReducer(
  initialSelectedState,

  on(SelectedStateActions.selectUnit, (state, { unit }) => ({
    unit,
    multiSelect: state.multiSelect,
    singleSelectId: undefined,
    multiSelectIds: undefined,
  })),

  on(SelectedStateActions.toggleMultiSelect, (state, { multiSelect }) => ({
    unit: state.unit,
    multiSelect,
    singleSelectId: state.singleSelectId,
    multiSelectIds: state.multiSelectIds,
  })),

  on(SelectedStateActions.selectId, (state, { id }) => ({
    unit: state.unit,
    multiSelect: false,
    singleSelectId: id,
    multiSelectIds: undefined,
  })),

  on(SelectedStateActions.selectMultiIds, (state, { ids }) => ({
    unit: state.unit,
    multiSelect: true,
    singleSelectId: undefined,
    multiSelectIds: ids,
  })),

  on(SelectedStateActions.selectPanel, (state, { panelId }) => ({
    unit: UnitModel.PANEL,
    multiSelect: false,
    multiSelectIds: [],
    singleSelectId: panelId,
  })),

  on(SelectedStateActions.startMultiselectPanel, (state, { panelId }) => ({
    multiSelectUnit: UnitModel.PANEL,
    multiSelect: true,
    multiSelectIds: addToMultiSelectArray(panelId, state.multiSelectIds),
  })),

  on(SelectedStateActions.addPanelToMultiselect, (state, { panelId }) => {
    return addPanelToMultiselect(panelId, state)
  }),

  /*  on(SelectedStateActions.addPanelToMultiselect, (state, { panelId }) => ({
      multiSelectUnit: UnitModel.PANEL,
      multiSelect: true,
      multiSelectIds: addToMultiSelectArray(panelId, state.multiSelectIds),
    })),*/

  on(SelectedStateActions.selectCable, (state, { cableId }) => ({
    unit: UnitModel.CABLE,
    multiSelect: false,
    singleSelectId: cableId,
  })),

  on(SelectedStateActions.selectTray, (state, { trayId }) => ({
    unit: UnitModel.TRAY,
    multiSelect: false,
    singleSelectId: trayId,
  })),

  on(SelectedStateActions.selectRail, (state, { railId }) => ({
    unit: UnitModel.RAIL,
    multiSelect: false,
    singleSelectId: railId,
  })),

  on(SelectedStateActions.setSelectedPanelLinks, (state, { panelLink }) => ({
    unit: state.unit,
    multiSelect: false,
    singleSelectId: state.singleSelectId,
    multiSelectIds: [],
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
    typeToJoin: UnitModel.UNDEFINED,
    panelToJoin: undefined,
    dpToJoin: undefined,
  })),

  on(SelectedStateActions.selectString, (state, { stringId }) => ({
    unit: UnitModel.STRING,
    singleSelectId: stringId,
    selectedStringId: stringId,
    multiSelectIds: undefined,
    selectedPositiveLinkTo: undefined,
    selectedNegativeLinkTo: undefined,
  })),

  on(SelectedStateActions.selectDp, (state, { dpId }) => ({
    unit: UnitModel.DISCONNECTIONPOINT,
    singleSelectId: dpId,
  })),

  on(SelectedStateActions.setSelectedStringPanels, (state, { panelIds }) => ({
    unit: UnitModel.STRING,
    singleSelectId: state.singleSelectId,
    multiSelectIds: panelIds,
    selectedPositiveLinkTo: undefined,
    selectedNegativeLinkTo: undefined,
  })),

  on(SelectedStateActions.setSelectedStringTooltip, (state, { tooltip }) => ({
    unit: UnitModel.STRING,
    singleSelectId: state.singleSelectId,
    multiSelectIds: state.multiSelectIds,
    selectedStringTooltip: tooltip,
    selectedPositiveLinkTo: undefined,
    selectedNegativeLinkTo: undefined,
  })),

  on(SelectedStateActions.clearSelectedState, (state) => ({
    unit: UnitModel.UNDEFINED,
    multiSelect: false,
    singleSelectId: undefined,
    multiSelectIds: [],
    selectedPositiveLinkTo: undefined,
    selectedNegativeLinkTo: undefined,
    typeToJoin: UnitModel.UNDEFINED,
    panelToJoin: undefined,
    dpToJoin: undefined,
  })),
)
