import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './grid.reducer'

export const selectGridState = createFeatureSelector<State.GridState>('grid')

export const selectGridStringsAndMode = (state: State.GridState) => state

// export const selectSelectedStrings = (state: State.GridState) => state.strings
// export const selectCreateMode = (state: State.GridState) => state.createMode

export const selectSelectedStrings = createSelector(
  selectGridState,
  (state: State.GridState) => state.strings,
)

export const selectCreateMode = createSelector(
  selectGridState,
  (state: State.GridState) => state.createMode,
)
