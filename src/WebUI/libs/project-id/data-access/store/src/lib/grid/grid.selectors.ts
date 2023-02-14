import { createFeatureSelector, createSelector } from '@ngrx/store'
import { GridState, GRID_FEATURE_KEY } from './grid.reducer'

export const selectGridState = createFeatureSelector<GridState>(GRID_FEATURE_KEY)

export const selectCreateMode = createSelector(
  selectGridState,
  (state: GridState) => state.createMode,
)

export const selectGridMode = createSelector(selectGridState, (state: GridState) => state.gridMode)

export const selectClientXY = createSelector(selectGridState, (state: GridState) => state.clientXY)
