import { ClientXY, GridLayoutXY, MouseXY, PosXY } from '@grid-layout/shared/models'
import { Action, createReducer, on } from '@ngrx/store'
import { GridActions } from 'libs/project-id/data-access/store/src/lib/grid'

import { UiActions } from './ui.actions'

export const UI_FEATURE_KEY = 'ui'


export interface UiState {
  keymap: boolean
  gridLayoutXY: GridLayoutXY
  gridLayoutZoom: number
  gridLayoutMoving: boolean
  clientXY: ClientXY
  mouseXY: MouseXY
  posXY: PosXY
}

export const initialUiState: UiState = {
  keymap: true,
  gridLayoutXY: {
    componentX: undefined,
    componentY: undefined,
  },
  gridLayoutZoom: 1,
  gridLayoutMoving: false,
  mouseXY: {
    mouseX: undefined,
    mouseY: undefined,
  },
  posXY: {
    posX: undefined,
    posY: undefined,
  },
  clientXY: {
    clientX: undefined,
    clientY: undefined,
  },
}


const reducer = createReducer(
  initialUiState,
  on(UiActions.toggleKeymap, (state) => ({ ...state, keymap: !state.keymap })),
  on(UiActions.turnKeymapOn, (state) => ({ ...state, keymap: true })),
  on(UiActions.turnKeymapOff, (state) => ({ ...state, keymap: false })),
  on(UiActions.setGridlayoutComponentXy, (state, { gridLayoutXY }) => ({
    ...state,
    gridLayoutXY,
  })),
  on(UiActions.stopGridlayoutMoving, (state) => ({ ...state, gridLayoutMoving: false })),
  on(UiActions.resetGridlayoutComponentXy, (state) => ({
    ...state, gridLayoutXY: {
      componentX: undefined,
      componentY: undefined,
    },
    gridLayoutMoving: false,
  })),
  on(UiActions.setGridlayoutZoom, (state, { zoom }) => ({ ...state, gridLayoutZoom: zoom })),
  on(UiActions.resetGridlayoutZoom, (state) => ({
    ...state, zoom: 1,
  })),
  on(UiActions.setMouseXy, (state, { mouseXY }) => ({
    ...state,
    mouseXY,

    gridLayoutMoving: true,
  })),
  on(UiActions.resetMouseXy, (state) => ({
    ...state,
    mouseXY: {
      mouseX: undefined,
      mouseY: undefined,
    },

    gridLayoutMoving: true,
  })),
  on(UiActions.setPosXy, (state, { posXY }) => ({
    ...state,
    posXY,
  })),
  on(UiActions.resetPosXy, (state) => ({
    ...state,
    posXY: {
      posX: undefined,
      posY: undefined,
    },

    gridLayoutMoving: true,
  })),
  on(UiActions.setClientxy, (state, { clientXY }) => ({
    ...state,
    clientXY,
  })),
  on(UiActions.clearClientxy, (state) => ({
    ...state,
    clientXY: {
      clientX: undefined,
      clientY: undefined,
    },
  })),
)

export function uiReducer(state: UiState | undefined, action: Action) {
  return reducer(state, action)
}
