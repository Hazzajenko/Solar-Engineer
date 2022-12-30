import { Action, createReducer, on } from '@ngrx/store'
import { BlockType, GridMode } from '@shared/data-access/models'
import { GridActions } from './grid.actions'

export const GRID_FEATURE_KEY = 'grid'

export interface GridState {
  createMode: BlockType
  gridMode: GridMode
}

export const initialGridState: GridState = {
  createMode: BlockType.PANEL,
  gridMode: GridMode.SELECT,
}

export const reducer = createReducer(
  initialGridState,

  on(GridActions.changeCreateType, (state, { createType }) => ({
    createMode: createType,
    gridMode: state.gridMode,
  })),

  on(GridActions.clearGridState, (state) => ({
    createMode: state.createMode,
    gridMode: GridMode.SELECT,
  })),

  on(GridActions.selectGridmodeCreate, (state) => ({
    createMode: state.createMode,
    gridMode: GridMode.CREATE,
  })),

  on(GridActions.selectGridmodeDelete, (state) => ({
    createMode: state.createMode,
    gridMode: GridMode.DELETE,
  })),

  on(GridActions.selectGridmodeLink, (state) => ({
    createMode: state.createMode,
    gridMode: GridMode.LINK,
  })),

  on(GridActions.selectGridmodeSelect, (state) => ({
    createMode: state.createMode,
    gridMode: GridMode.SELECT,
  })),
)

export function gridReducer(state: GridState | undefined, action: Action) {
  return reducer(state, action)
}
