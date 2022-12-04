import { createReducer, on } from '@ngrx/store'
import { GridStateActions } from './grid.actions'
import { StringModel } from '../../../../models/string.model'
import { GridMode } from './grid-mode.model'
import { UnitModel } from '../../../../models/unit.model'
import { PanelModel } from '../../../../models/panel.model'

export interface GridState {
  strings: StringModel[]
  selected?: StringModel
  createMode: UnitModel
  gridMode: GridMode
  toJoin: string[]
  panelToJoin: PanelModel[]
}

export const initialGridState: GridState = {
  strings: [],
  selected: undefined,
  createMode: UnitModel.PANEL,
  gridMode: GridMode.CREATE,
  toJoin: [],
  panelToJoin: [],
}

export const gridReducer = createReducer(
  initialGridState,

  on(GridStateActions.selectCreateMode, (state, action) => ({
    createMode: action.create,
    selected: state.selected,
    strings: state.strings,
    gridMode: state.gridMode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.clearGridState, (state) => ({
    strings: [],
    selected: undefined,
    createMode: state.createMode,
    gridMode: GridMode.CREATE,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectGridmodeCreate, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectGridmodeDelete, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectGridmodeJoin, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.changeGridmode, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),
)
