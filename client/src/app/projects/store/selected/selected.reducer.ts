import { createReducer, on } from '@ngrx/store'
import { SelectedStateActions } from './selected.actions'
import { UnitModel } from '../../models/unit.model'

export interface SelectedState {
  unit?: UnitModel
  multiSelect: boolean
  singleSelectId?: string
  multiSelectIds?: string[]
}

export const initialSelectedState: SelectedState = {
  unit: UnitModel.UNDEFINED,
  multiSelect: false,
  singleSelectId: undefined,
  multiSelectIds: undefined,
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

  on(SelectedStateActions.clearSelectedState, (state) => ({
    unit: UnitModel.UNDEFINED,
    multiSelect: false,
    singleSelectId: undefined,
    multiSelectIds: undefined,
  })),
)
