import { createReducer, on } from '@ngrx/store'
import { SelectedStateActions } from './selected.actions'
import { StringModel } from '../../models/string.model'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'

export interface SelectedState {
  unit?: UnitModel
  strings?: StringModel[]
  string?: StringModel
  panels?: PanelModel[]
  panel?: PanelModel
}

export const initialSelectedState: SelectedState = {
  unit: UnitModel.UNDEFINED,
  strings: undefined,
  string: undefined,
  panels: undefined,
  panel: undefined,
}

export const selectedReducer = createReducer(
  initialSelectedState,

  on(SelectedStateActions.selectPanel, (state, action) => ({
    unit: UnitModel.PANEL,
    panel: action.panel,
    strings: undefined,
    string: undefined,
    panels: [action.panel],
  })),
)
