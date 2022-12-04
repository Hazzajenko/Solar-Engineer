import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './multi-create.reducer'

export const selectMultiCreateState =
  createFeatureSelector<State.MultiCreateState>('multiCreates')

export const selectTypeToMultiCreate = createSelector(
  selectMultiCreateState,
  (state: State.MultiCreateState) => state.typeToMultiCreate,
)

export const selectMultiCreateStartLocation = createSelector(
  selectMultiCreateState,
  (state: State.MultiCreateState) => state.locationStart,
)

export const selectMultiCreateFinishLocation = createSelector(
  selectMultiCreateState,
  (state: State.MultiCreateState) => state.locationFinish,
)
