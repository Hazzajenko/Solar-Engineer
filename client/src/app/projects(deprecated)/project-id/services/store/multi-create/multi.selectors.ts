import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './multi.reducer'

export const selectMultiState = createFeatureSelector<State.MultiState>('multi')

export const selectMultiMode = createSelector(
  selectMultiState,
  (state: State.MultiState) => state.multiMode,
)
export const selectTypeToMultiCreate = createSelector(
  selectMultiState,
  (state: State.MultiState) => state.typeToMultiCreate,
)

export const selectMultiCreateStartLocation = createSelector(
  selectMultiState,
  (state: State.MultiState) => state.locationStart,
)

export const selectMultiCreateFinishLocation = createSelector(
  selectMultiState,
  (state: State.MultiState) => state.locationFinish,
)