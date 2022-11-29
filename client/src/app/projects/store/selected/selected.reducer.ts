import { createReducer, on } from '@ngrx/store'
import { SelectedStateActions } from './selected.actions'
import { UnitModel } from '../../models/unit.model'

export interface SelectedState {
  unit?: UnitModel
  multiSelect?: boolean
  singleSelectId?: string
  multiSelectIds?: string[]
  selectedPositiveLinkTo?: string
  selectedNegativeLinkTo?: string
  selectedStringTooltip?: string
}

export const initialSelectedState: SelectedState = {
  unit: UnitModel.UNDEFINED,
  multiSelect: false,
  singleSelectId: undefined,
  multiSelectIds: undefined,
  selectedPositiveLinkTo: undefined,
  selectedNegativeLinkTo: undefined,
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
    singleSelectId: panelId,
    multiSelectIds: undefined,
    selectedPositiveLinkTo: undefined,
    selectedNegativeLinkTo: undefined,
    typeToJoin: UnitModel.UNDEFINED,
    panelToJoin: undefined,
    dpToJoin: undefined,
  })),

  on(SelectedStateActions.setSelectedPanelLinks, (state, { panelLink }) => ({
    unit: state.unit,
    multiSelect: false,
    singleSelectId: state.singleSelectId,
    multiSelectIds: undefined,
    selectedPositiveLinkTo: panelLink.selectedPositiveLinkTo,
    selectedNegativeLinkTo: panelLink.selectedNegativeLinkTo,
    typeToJoin: UnitModel.UNDEFINED,
    panelToJoin: undefined,
    dpToJoin: undefined,
  })),

  on(SelectedStateActions.selectString, (state, { stringId }) => ({
    unit: UnitModel.STRING,
    singleSelectId: stringId,
    multiSelectIds: undefined,
    selectedPositiveLinkTo: undefined,
    selectedNegativeLinkTo: undefined,
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
    multiSelectIds: undefined,
    selectedPositiveLinkTo: undefined,
    selectedNegativeLinkTo: undefined,
    typeToJoin: UnitModel.UNDEFINED,
    panelToJoin: undefined,
    dpToJoin: undefined,
  })),
)
