import { createFeatureSelector, createSelector } from '@ngrx/store'
import { PANELS_FEATURE_KEY, panelsAdapter, PanelsState } from './panels.reducer'

export const selectPanelsState = createFeatureSelector<PanelsState>(PANELS_FEATURE_KEY)

const { selectAll, selectEntities } = panelsAdapter.getSelectors()

export const selectPanelsLoaded = createSelector(
  selectPanelsState,
  (state: PanelsState) => state.loaded,
)

export const selectPanelsError = createSelector(
  selectPanelsState,
  (state: PanelsState) => state.error,
)

export const selectAllPanels = createSelector(selectPanelsState, (state: PanelsState) =>
  selectAll(state),
)

export const selectPanelsEntities = createSelector(selectPanelsState, (state: PanelsState) =>
  selectEntities(state),
)
