import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './grid.reducer'

export const selectGridState = createFeatureSelector<State.GridState>('grid')

export const selectGridEntities = createSelector(
  selectGridState,
  State.selectEntities,
)

export const selectAllGrid = createSelector(selectGridState, State.selectAll)
