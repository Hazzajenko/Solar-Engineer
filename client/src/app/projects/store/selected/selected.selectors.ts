import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './selected.reducer'

export const selectSelectedState =
  createFeatureSelector<State.SelectedState>('selected')

export const selectUnitSelected = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.unit,
)

export const selectSelectedPanels = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.panels,
)

export const selectSelectedStrings = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.strings,
)
