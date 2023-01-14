import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UI_FEATURE_KEY, UiState } from 'libs/project-id/data-access/store/src/lib/ui/ui.reducer'

export const selectUiState = createFeatureSelector<UiState>(UI_FEATURE_KEY)

export const selectIsKeymapEnabled = createSelector(
  selectUiState,
  (state: UiState) => state.keymap,
)

export const selectNavMenuState = createSelector(
  selectUiState,
  (state: UiState) => state.navMenu,
)

export const selectIsPathLinesEnabled = createSelector(
  selectUiState,
  (state: UiState) => state.pathLines,
)

export const selectIsStringStatsEnabled = createSelector(
  selectUiState,
  (state: UiState) => state.stringStats,
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

export const selectKeyPressed = createSelector(selectUiState, (state: UiState) => state.keyPressed)

export const selectScale = createSelector(selectUiState, (state: UiState) => state.scale)


export const selectClientXY = createSelector(selectUiState, (state: UiState) => state.clientXY)
