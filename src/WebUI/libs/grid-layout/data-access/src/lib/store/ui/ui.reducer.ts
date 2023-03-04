import { ClientXY, GridLayoutXY, MouseXY, PosXY } from '@grid-layout/shared/models'
import { Action, createReducer, on } from '@ngrx/store'
import { WindowSizeModel } from '@shared/data-access/models'
import { GridActions } from 'libs/project-id/data-access/store/src/lib/grid'

import { UiActions } from './ui.actions'

export const UI_FEATURE_KEY = 'ui'


export interface UiState {
  keymap: boolean
  navMenu: boolean
  pathLines: boolean
  stringStats: boolean
  gridLayoutXY: GridLayoutXY
  gridLayoutZoom: number
  gridLayoutMoving: boolean
  clientXY: ClientXY
  mouseXY: MouseXY
  posXY: PosXY
  keyPressed: string
  scale: number
  windowSize: WindowSizeModel
}

export const initialUiState: UiState = {
  keymap: true,
  navMenu: false,
  pathLines: true,
  stringStats: true,
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
  keyPressed: '',
  scale: 1,
  windowSize: {
    innerHeight: undefined,
    innerWidth: undefined,
  },
}


const reducer = createReducer(
  initialUiState,
  on(UiActions.toggleKeymap, (state) => ({ ...state, keymap: !state.keymap })),
  on(UiActions.togglePathLines, (state) => ({ ...state, pathLines: !state.pathLines })),
  on(UiActions.toggleStringStatistics, (state) => ({ ...state, stringStats: !state.stringStats })),
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
  on(UiActions.keyPressed, (state, { key }) => ({
    ...state,
    keyPressed: key,
  })),
  on(UiActions.setScale, (state, { scale }) => ({
    ...state,
    scale,
  })),
  on(UiActions.setClientxy, (state, { clientXY }) => ({
    ...state,
    clientXY,
  })),
  on(UiActions.toggleNavmenu, (state) => ({
    ...state,
    navMenu: !state.navMenu,
  })),
  on(UiActions.clearClientxy, (state) => ({
    ...state,
    clientXY: {
      clientX: undefined,
      clientY: undefined,
    },
  })),
  on(UiActions.setWindowSize, (state, { windowSize }) => ({
    ...state,
    windowSize,
  })),
)

export function uiReducer(state: UiState | undefined, action: Action) {
  return reducer(state, action)
}
