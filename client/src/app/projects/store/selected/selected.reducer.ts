import { createReducer, on } from '@ngrx/store'
import { SelectedStateActions } from './selected.actions'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'

export interface SelectedState {
  unit?: UnitModel
  strings?: string[]
  // strings?: StringModel[]
  // string?: StringModel
  disconnectionPoint?: string
  panels?: PanelModel[]
  // panel?: PanelModel
}

export const initialSelectedState: SelectedState = {
  unit: UnitModel.UNDEFINED,
  strings: undefined,
  disconnectionPoint: undefined,
  // string: undefined,
  panels: undefined,
  // panel: undefined,
}

export const selectedReducer = createReducer(
  initialSelectedState,

  on(SelectedStateActions.selectPanel, (state, action) => ({
    unit: UnitModel.PANEL,
    panel: action.panel,
    strings: undefined,
    disconnectionPoint: undefined,
    panels: [action.panel],
  })),

  on(SelectedStateActions.selectString, (state, { stringId }) => ({
    unit: UnitModel.STRING,
    strings: [stringId],
    disconnectionPoint: undefined,
    panels: undefined,
  })),

  on(
    SelectedStateActions.selectDisconnectionPoint,
    (state, { disconnectionPointId }) => ({
      unit: UnitModel.DISCONNECTIONPOINT,
      strings: undefined,
      disconnectionPoint: disconnectionPointId,
      panels: undefined,
    }),
  ),

  on(SelectedStateActions.clearSelectedState, (state) => ({
    unit: UnitModel.UNDEFINED,
    strings: undefined,
    disconnectionPoints: undefined,
    panels: undefined,
  })),
)
