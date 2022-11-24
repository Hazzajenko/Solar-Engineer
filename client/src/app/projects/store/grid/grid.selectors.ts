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

export const selectSelectedString = createSelector(
  selectGridState,
  (state: State.GridState) => state.selected,
)

export const selectCreateMode = createSelector(
  selectGridState,
  (state: State.GridState) => state.createMode,
)

export const selectGridMode = createSelector(
  selectGridState,
  (state: State.GridState) => state.gridMode,
)

export const selectToJoinArray = createSelector(
  selectGridState,
  (state: State.GridState) => state.toJoin,
)

export const selectPanelToJoin = createSelector(
  selectGridState,
  (state: State.GridState) => state.panelToJoin,
)
