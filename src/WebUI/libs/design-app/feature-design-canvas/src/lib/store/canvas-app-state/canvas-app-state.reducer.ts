import { pushItemsIfNotExist } from '../../utils'
import { CanvasAppStateActions } from './canvas-app-state.actions'
import { Action, createReducer, on } from '@ngrx/store'

export const CANVAS_APP_STATE_FEATURE_KEY = 'canvas-app-state'

export type CanvasAppState = {
  hoveringEntityId: string | undefined
  selectedId: string | undefined
  selectedIds: string[]
  selectedStringId: string | undefined
  rotatingEntityId: string | undefined
  rotatingEntityIds: string[]
  draggingEntityId: string | undefined
  draggingEntityIds: string[]
}

export const initialCanvasAppState: CanvasAppState = {
  hoveringEntityId: undefined,
  selectedId: undefined,
  selectedIds: [],
  selectedStringId: undefined,
  rotatingEntityId: undefined,
  rotatingEntityIds: [],
  draggingEntityId: undefined,
  draggingEntityIds: [],
}

const reducer = createReducer(
  initialCanvasAppState,
  on(CanvasAppStateActions.setHoveringEntityId, (state, { hoveringEntityId }) => ({
    ...state,
    hoveringEntityId,
  })),
  on(CanvasAppStateActions.setSelectedId, (state, { selectedId }) => ({
    ...state,
    selectedId,
  })),
  on(CanvasAppStateActions.setSelectedIds, (state, { selectedIds }) => ({
    ...state,
    selectedIds,
  })),
  on(CanvasAppStateActions.addToSelectedIds, (state, { selectedIds }) => ({
    ...state,
    selectedIds: pushItemsIfNotExist(state.selectedIds, selectedIds),
  })),
  on(CanvasAppStateActions.removeFromSelectedIds, (state, { selectedIds }) => ({
    ...state,
    selectedIds: state.selectedIds.filter((id) => !selectedIds.includes(id)),
  })),
  on(CanvasAppStateActions.setSelectedStringId, (state, { selectedStringId }) => ({
    ...state,
    selectedStringId,
  })),
  on(CanvasAppStateActions.setRotatingEntityId, (state, { rotatingEntityId }) => ({
    ...state,
    rotatingEntityId,
  })),
  on(CanvasAppStateActions.setRotatingEntityIds, (state, { rotatingEntityIds }) => ({
    ...state,
    rotatingEntityIds,
  })),
  on(CanvasAppStateActions.setDraggingEntityId, (state, { draggingEntityId }) => ({
    ...state,
    draggingEntityId,
  })),
  on(CanvasAppStateActions.clearState, () => initialCanvasAppState),
)

export function canvasAppStateReducer(state: CanvasAppState | undefined, action: Action) {
  return reducer(state, action)
}