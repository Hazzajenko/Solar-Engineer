import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UI_FEATURE_KEY, UiState } from 'libs/project-id/data-access/store/src/lib/ui/ui.reducer'

export const selectUiState = createFeatureSelector<UiState>(UI_FEATURE_KEY)

export const selectIsKeymapEnabled = createSelector(
  selectUiState,
  (state: UiState) => state.keymap,
)

export const selectPosXY = createSelector(
  selectUiState,
  (state: UiState) => state.posXY,
)

export const selectMouseXY = createSelector(
  selectUiState,
  (state: UiState) => state.mouseXY,
)

export const selectGridLayoutXY = createSelector(
  selectUiState,
  (state: UiState) => state.gridLayoutXY,
)

export const selectGridLayoutMoving = createSelector(
  selectUiState,
  (state: UiState) => state.gridLayoutMoving,
)

export const selectGridLayoutZoom = createSelector(selectUiState, (state: UiState) => state.gridLayoutZoom)

export const selectClientXY = createSelector(selectUiState, (state: UiState) => state.clientXY)
