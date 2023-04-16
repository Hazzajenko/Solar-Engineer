import { CANVAS_APP_STATE_FEATURE_KEY, CanvasAppState } from './canvas-app-state.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectCanvasAppStateState = createFeatureSelector<CanvasAppState>(
  CANVAS_APP_STATE_FEATURE_KEY,
)

export const selectHoveringEntityId = createSelector(
  selectCanvasAppStateState,
  (state: CanvasAppState) => state.hoveringEntityId,
)

export const selectSelectedId = createSelector(
  selectCanvasAppStateState,
  (state: CanvasAppState) => state.selectedId,
)

export const selectSelectedIds = createSelector(
  selectCanvasAppStateState,
  (state: CanvasAppState) => state.selectedIds,
)

export const selectRotatingEntityId = createSelector(
  selectCanvasAppStateState,
  (state: CanvasAppState) => state.rotatingEntityId,
)

export const selectRotatingEntityIds = createSelector(
  selectCanvasAppStateState,
  (state: CanvasAppState) => state.rotatingEntityIds,
)

export const selectDraggingEntityId = createSelector(
  selectCanvasAppStateState,
  (state: CanvasAppState) => state.draggingEntityId,
)

export const selectDraggingEntityIds = createSelector(
  selectCanvasAppStateState,
  (state: CanvasAppState) => state.draggingEntityIds,
)