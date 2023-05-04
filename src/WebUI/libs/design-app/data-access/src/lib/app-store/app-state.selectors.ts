import { APP_STATE_FEATURE_KEY, AppState } from './app-state.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectAppStateState = createFeatureSelector<AppState>(APP_STATE_FEATURE_KEY)

export const selectDragBoxState = createSelector(
	selectAppStateState,
	(state: AppState) => state.dragBox,
)

export const selectPointerState = createSelector(
	selectAppStateState,
	(state: AppState) => state.pointer,
)

export const selectToMoveState = createSelector(
	selectAppStateState,
	(state: AppState) => state.toMove,
)

export const selectToRotateState = createSelector(
	selectAppStateState,
	(state: AppState) => state.toRotate,
)

export const selectViewPositioningState = createSelector(
	selectAppStateState,
	(state: AppState) => state.view,
)

export const selectPreviewAxisState = createSelector(
	selectAppStateState,
	(state: AppState) => state.previewAxis,
)

export const selectModeState = createSelector(selectAppStateState, (state: AppState) => state.mode)

export const selectContextMenuState = createSelector(
	selectAppStateState,
	(state: AppState) => state.contextMenu,
)

export const selectSelectedState = createSelector(
	selectAppStateState,
	(state: AppState) => state.selected,
)

export const APP_STATE_QUERIES = {
	selectAppStateState,
	selectDragBoxState,
	selectPointerState,
	selectToMoveState,
	selectToRotateState,
	selectViewPositioningState,
	selectPreviewAxisState,
	selectModeState,
	selectContextMenuState,
	selectSelectedState,
} as const

export type AppStateQueries = (typeof APP_STATE_QUERIES)[keyof typeof APP_STATE_QUERIES]

// APP_STATE_QUERIES.selectDragBoxState({})

/*
type fns = (...args: any[]) => any

type stateFns = typeof selectDragBoxState | typeof selectPointerState | typeof selectToMoveState | typeof selectToRotateState | typeof selectViewPositioningState | typeof selectPreviewAxisState | typeof selectModeState | typeof selectContextMenuState | typeof selectSelectedState
const what : stateFns = selectDragBoxState

what({})

const selectByFunc = (fn: fns) => createSelector(selectAppStateState, fn)

export const selectDragBox = selectByFunc(selectDragBoxState)

const selectByFuncName = (fn: stateFns) => createSelector(selectAppStateState, fn)

type StateFn = stateFns[keyof stateFns]

export const selectDragBox2: StateFn = selectDragBoxState

selectByFuncName(selectDragBoxState)*/
