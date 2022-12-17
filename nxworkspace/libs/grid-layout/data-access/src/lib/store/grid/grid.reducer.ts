import { createReducer, on } from '@ngrx/store'
import { GridStateActions } from './grid.actions'
import { StringModel } from '@shared/data-access/models'
import { GridMode } from '@shared/data-access/models'
import { TypeModel } from '@shared/data-access/models'
import { PanelModel } from '@shared/data-access/models'

export interface GridState {
  strings: StringModel[]
  selected?: StringModel
  createMode: TypeModel
  gridMode: GridMode
  toJoin: string[]
  panelToJoin: PanelModel[]
}

export const initialGridState: GridState = {
  strings: [],
  selected: undefined,
  createMode: TypeModel.PANEL,
  gridMode: GridMode.SELECT,
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
