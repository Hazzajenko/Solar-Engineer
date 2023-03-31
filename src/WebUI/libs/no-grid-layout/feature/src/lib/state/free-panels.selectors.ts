import { FREE_PANELS_FEATURE_KEY, freePanelsAdapter, FreePanelsState } from './free-panels.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';


// Lookup the 'FreePanels' feature state managed by NgRx
export const selectFreePanelsState = createFeatureSelector<FreePanelsState>(FREE_PANELS_FEATURE_KEY)

const { selectAll, selectEntities } = freePanelsAdapter.getSelectors()

export const selectFreePanelsLoaded = createSelector(
  selectFreePanelsState,
  (state: FreePanelsState) => state.loaded,
)

export const selectFreePanelsError = createSelector(
  selectFreePanelsState,
  (state: FreePanelsState) => state.error,
)

export const selectAllFreePanels = createSelector(selectFreePanelsState, (state: FreePanelsState) =>
  selectAll(state),
)

export const selectFreePanelById = (id: string) =>
  createSelector(selectFreePanelsState, (state: FreePanelsState) => state.entities[id])

export const selectFreePanelsEntities = createSelector(
  selectFreePanelsState,
  (state: FreePanelsState) => selectEntities(state),
)

export const selectSelectedId = createSelector(
  selectFreePanelsState,
  (state: FreePanelsState) => state.selectedId,
)

export const selectEntity = createSelector(
  selectFreePanelsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
)