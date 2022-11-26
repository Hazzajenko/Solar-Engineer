import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './joins.reducer'

export const selectJoinsState = createFeatureSelector<State.JoinsState>('joins')

export const selectPanelToJoin = createSelector(
  selectJoinsState,
  (state: State.JoinsState) => state.panelToJoin,
)

export const selectBlockToJoin = createSelector(
  selectJoinsState,
  (state: State.JoinsState) => state.blockToJoin,
)
