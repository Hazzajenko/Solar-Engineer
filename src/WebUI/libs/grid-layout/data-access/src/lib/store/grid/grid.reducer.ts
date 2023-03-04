import { ClientXY } from '../../models'
import { Action, createReducer, on } from '@ngrx/store'
import { BlockType, GridMode } from '@shared/data-access/models'
import { GridActions } from './grid.actions'

export const GRID_FEATURE_KEY = 'grid'

export interface GridState {
  createMode: BlockType
  gridMode: GridMode
  clientXY: ClientXY
}

export const initialGridState: GridState = {
  createMode: BlockType.PANEL,
  gridMode: GridMode.SELECT,
  clientXY: {
    clientX: undefined,
    clientY: undefined,
  },
}

export const reducer = createReducer(
  initialGridState,

  on(GridActions.changeCreateType, (state, { createType }) => ({
    ...state,
    createMode: createType,
  })),

  on(GridActions.clearGridState, (state) => ({
    ...state,
    gridMode: GridMode.SELECT,
  })),

  on(GridActions.selectGridmodeCreate, (state) => ({
    ...state,
    gridMode: GridMode.CREATE,
  })),

  on(GridActions.selectGridmodeDelete, (state) => ({
    ...state,
    gridMode: GridMode.DELETE,
  })),

  on(GridActions.selectGridmodeLink, (state) => ({
    ...state,
    gridMode: GridMode.LINK,
  })),

  on(GridActions.selectGridmodeSelect, (state) => ({
    ...state,
    gridMode: GridMode.SELECT,
  })),

  on(GridActions.setClientxy, (state, { clientXY }) => ({
    ...state,
    clientXY,
  })),
  on(GridActions.clearClientxy, (state) => ({
    ...state,
    clientXY: {
      clientX: undefined,
      clientY: undefined,
    },
  })),
)

export function gridReducer(state: GridState | undefined, action: Action) {
  return reducer(state, action)
}
